import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../services/api';
import { Router } from '@angular/router';

export interface study {
  // job_id: number;
  study_id: number;
  study_name: string;
  study_type: string;
  paltfrom: string;
  status: string;
  progress: number;
  loi: number;
  start_date: number;
  end_date: number;
  target: []
}

@Component({
  selector: 'app-study-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './study-list.html',
  styleUrl: './study-list.css',
})
export class StudyList {
  searchQuery: string = '';
  activeTab: 'all' | 'live' | 'complete' = 'all';
  company_name = localStorage.getItem('comp_name') || 'Company';
  comp_id = localStorage.getItem('comp_id');
  loader: any = signal(false);

  // Dummy metrics matching your image
  studyData: study[] = [];
  selectedSurvey: any = signal({});
  overAllResponse = signal([]);
  allStudies: any = signal([]);
  currentPage: number = 1;
  pageSize: number = 10;
  totalScreens: number = 69;
  showLogoutDialog = false;

  user: any = JSON.parse(localStorage.getItem('userDetails') ?? 'null');



  constructor(private api: Api, private router: Router) { }

  ngOnInit(): void {
    this.getStudies(this.comp_id);
  }

  getStudies(comp_id: any) {
    this.loader.set(true);
    this.api.getApi(`get-studies/?comp_id=${comp_id}`).subscribe((response: any) => {
      console.log(response);
      if (!response.error) {
        if (response.data) {
          this.overAllResponse.set(response.data);
          this.allStudies.set([...response.data.live, ...response.data.complete].filter((s: any) => s.tech_used == 'NODE').sort((a: any, b: any) => { return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()}));
          console.log(this.allStudies());
          this.studyData = this.allStudies().map((study: any) => {

            let totalAudience = 0;
            let currentAudience = 0;
            for (let i = 0; i < study.target.length; i++) {
              totalAudience = totalAudience + study.target[i].cnt_audience;
              currentAudience = currentAudience + study.target[i].cnt_current_audience;
            }
            const percentage = ((currentAudience / totalAudience) * 100).toFixed(1);
            return {
              // job_id: study.job_id,
              study_id: study.study_id,
              study_name: study.study_name,
              study_type: study.study_type,
              paltfrom: study.platform,
              status: study.status == 2 ? "Live" : "Complete",
              progress: percentage,
              loi: study.loi,
              start_date: study.start_date,
              end_date: study.end_date,
              target: study.target
            }
          })
        }

        this.loader.set(false);
      }
      else {
        console.error('Error fetching studies:', response.message);
      }
    });
  }

  
get filteredScreens(): study[] {
  return this.studyData.filter(row => {
    // 1. Tab filter
    if (this.activeTab === 'all') {
      // Do not filter out anything; let it move to the search phase
    } else if (this.activeTab === 'live' && row.status !== 'Live') {
      return false;
    } else if (this.activeTab === 'complete' && row.status !== 'Complete') {
      return false;
    }

    // 2. Search filter
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      return (
        row.study_name.toLowerCase().includes(query) ||
        row.study_id.toString().includes(query)
      );
    }

    return true;
  });
}

  setTab(tab: 'all' | 'live' | 'complete'): void {
    this.activeTab = tab;
    this.onFilterChange();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredScreens.length / this.pageSize) || 1;
  }

  get paginatedScreens(): study[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredScreens.slice(startIndex, endIndex);
  }

  get startRecord(): number {
    if (this.filteredScreens.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.filteredScreens.length ? this.filteredScreens.length : end;
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

  confirmLogout() {
  this.showLogoutDialog = false;
  localStorage.removeItem('token');
  localStorage.removeItem('comp_id');
  localStorage.removeItem('comp_name');
  this.router.navigate(['/']);
}

selectStudy(study: study){
  this.selectedSurvey.set(study);
  localStorage.setItem("selectedSurvey", JSON.stringify(this.selectedSurvey()));
  this.router.navigate(['/dashboard/user-termination'], {queryParams: {study_id: study.study_id}});
}

NavigateToCompanyList(){
  this.router.navigate(['/dashboard/company-list']);
}
  
}


