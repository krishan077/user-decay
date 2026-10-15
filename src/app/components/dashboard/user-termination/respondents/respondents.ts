import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface User {
  "id": number,
  "started": string,
  "source": string,
  "profile": string,
  "cell": string,
  "quotaGroup": string,
  "screens": string,
  "time": string,
  "exitedAt": {
    "title": string,
    "subtitle": string
  },
  "disposition": object
}

interface FlatQuestion {
  category: string;
  question: string;
  spss: string;
  type: string;
}

@Component({
  selector: 'app-respondents',
  imports: [FormsModule, CommonModule],
  templateUrl: './respondents.html',
  styleUrl: './respondents.css',
})
export class Respondents {
  @Input() usersData: any[] = [];
  tableHeaders: string[] = ['ID', 'Started', 'Source', 'Profile', 'Cell', 'Quota Group', 'Screens', 'Time', 'Exited At', 'Disposition'];
  tabelData: User[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalScreens: number = 69;
  searchQuery: string = '';
  @Input() allQuestions: FlatQuestion[] = [];
  selectedQuestion

  

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Users Data:', this.usersData);

    if (changes['usersData'] && changes['usersData'].currentValue) {
      if (this.usersData && this.usersData.length > 0) {
        this.usersData.forEach(user => {
          // console.log('User:', user);
          this.tabelData.push({
            id:  user.wh_mo_id,
            started: user.created_at
              ? new Date(user.created_at).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })
              : '-',
            source: user.request_data?.panel ?? '-',
            profile: `${user.audience?.au_gender ?? '-'}, ${user.audience?.au_age ?? '-'}`,
            cell: user.content?.cnt_name?.replace('cell', '') ?? '-',
            quotaGroup: user.quotas?.[0]?.cnq_quota_name ?? '-',
            screens: user.events?.length ?? 0,
            time: '-',
            exitedAt: {
              title: user.user_termination?.reason ?? '-',
              subtitle: user.user_termination?.reason ?? ''
            },
            disposition: {
              status: 'Terminated',
              color: 'red',
              icon: 'circle'
            }
          });
          console.log('Table Data:', this.tabelData);
        });
      }
    }
  }

  
  get totalPages(): number {
      return Math.ceil(this.tabelData.length / this.pageSize) || 1;
    }
  
    get paginatedUsers(): User[] {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.tabelData.slice(startIndex, endIndex);
    }
  
    get startRecord(): number {
      if (this.tabelData.length === 0) return 0;
      return (this.currentPage - 1) * this.pageSize + 1;
    }
  
    get endRecord(): number {
      const end = this.currentPage * this.pageSize;
      return end > this.tabelData.length ? this.tabelData.length : end;
    }
  
    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  
    onFilterChange(): void {
      this.currentPage = 1;
    }
}
