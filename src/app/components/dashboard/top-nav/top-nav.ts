import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  imports: [],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav {
  company_name = localStorage.getItem('comp_name') || 'Company';
  comp_id = localStorage.getItem('comp_id');
  showLogoutDialog = false;

  constructor(private router: Router){}

  confirmLogout() {
  this.showLogoutDialog = false;
  localStorage.removeItem('token');
  localStorage.removeItem('comp_id');
  localStorage.removeItem('comp_name');
  this.router.navigate(['/']);
}
}
