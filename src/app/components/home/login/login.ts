import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../../services/api';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  showPassword = false;
  isHovered = false;
  loginForm !: FormGroup
  loader: boolean = false;

  constructor(private router: Router, private authService: Auth, private _fb: FormBuilder, private _api: Api) {
    this.validation();
  }

  onSubmit() {
    if (this.loginForm?.valid) {
      this.loader = true;
      this._api.postApi('login', this.loginForm.value).subscribe((response: any) => {
        this.loader = false;
        if (!response.error) {
          if (response.data && response.data.token) {
            this.authService.login(response.data.token);
            this.processLoginResponse(response);
          } else {
            //OTP case will be handled here
          }
        } else {

        }
      })
    }
  }

  validation() {
    this.loginForm = this._fb.group({
      company_email: ['', Validators.compose([Validators.email, Validators.required])],
      company_password: ['', Validators.required]
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  processLoginResponse(res: any): void {
    localStorage.setItem('comp_id', res.data.comp_id);
    localStorage.setItem('comp_name', res.data.name);
    if (res.data.role === 'monet-user' || res.data.role === 'monet-admin') {
      localStorage.setItem('userDetails', JSON.stringify(res.data));
      localStorage.setItem('monet-user', JSON.stringify(true));
      this.router.navigate(['/dashboard/company-list']);
    } else {
      localStorage.setItem('logged_in', 'true');
      this.router.navigate(['/dashboard/study-list']);
    }
    this.loader = true;
  }
}
