import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../services/api';
import { Router } from '@angular/router';

export interface company {
  // job_id: number;
  comp_id: number;
  comp_name: string;
  email: string;
  study_details: {
    draft: number,
    review: number,
    live: number,
    complete: number,
    shared: number
}
}

@Component({
  selector: 'app-company-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css',
})
export class CompanyList {

  searchQuery: string = '';
  loader: any = signal(false);
  currentPage: number = 1;
  pageSize: number = 10;
  totalCompanies: number = 69;
  showLogoutDialog = false;
  user: any = JSON.parse(localStorage.getItem('userDetails') ?? 'null');
  selectedCompany: any = null;
  companyDetais: company[] = []

  constructor(private _as: Api, private router: Router) { }

  ngOnInit() {
    this.getCompanies();
    localStorage.removeItem('logged_in');
    localStorage.removeItem('comp_id');
  }

  getCompanies() {
    this.loader.set(true);
    this._as.getApi(`get-companies?completed=1`).subscribe((res: any) => {
      this.loader.set(false);
      if (res && !res.error) {
        this.companyDetais = res.data;
        console.log(this.companyDetais);
      }
      else {
        // this._as.obNotify({status:'error',message:res.message});
      }
    })
  }

  get filteredCompanies(): company[] {
    return this.companyDetais.filter(comp => {

      const query = this.searchQuery.toLowerCase().trim();
      if (query) {
        return (
          comp.comp_name.toLowerCase().includes(query) ||
          comp.comp_id.toString().includes(query)
        );
      }

      return true;
    });
  }

    // 2. Calculate total pages dynamically
    get totalPages(): number {
      return Math.ceil(this.filteredCompanies.length / this.pageSize) || 1;
    }

    get paginatedScreens(): company[] {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredCompanies.slice(startIndex, endIndex);
    }

    get startRecord(): number {
      if (this.filteredCompanies.length === 0) return 0;
      return (this.currentPage - 1) * this.pageSize + 1;
    }

    get endRecord(): number {
      const end = this.currentPage * this.pageSize;
      return end > this.filteredCompanies.length ? this.filteredCompanies.length : end;
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


  selectCompany(company: company){
    this.selectedCompany = company;
    this.goToReport(this.selectedCompany)
  }

  goToReport(selectedCompany: company): void {
    if (!selectedCompany) {
      return;
    }
    this.loader.set(true);
    this._as.postApi('selectCompany',{comp_id: selectedCompany.comp_id}).subscribe((res:any)=>{
      this.loader.set(false);
      if(res && !res.error){
        console.log(res);
        
        this.processResponse(res.data);
      }
      else{
        // this._as.obNotify({status:'error',message:res.message});
      }
    })
  }

  processResponse(data:any){
    localStorage.setItem('logged_in', 'true');
    localStorage.setItem('token', data.token);
    localStorage.setItem('comp_id', data.comp_id);
    this.router.navigate(['/dashboard/study-list']);
  }

}
