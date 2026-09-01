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

  constructor(private router: Router, private authService: Auth, private _fb: FormBuilder, private _api: Api) {
    this.validation();
  }

  onSubmit() {
    if(this.loginForm?.valid){
      this._api.postApi('login', this.loginForm.value).subscribe((response: any)=>{
        if(!response.error){
          this.authService.login(response.data.token);
          localStorage.setItem('comp_id', response.data.comp_id);
          localStorage.setItem('comp_name', response.data.comp_name);
          this.router.navigate(['/dashboard']);
        }else{
        }
      })
    }
  }

  validation(){
    this.loginForm = this._fb.group({
    company_email: ['', Validators.compose([Validators.email, Validators.required])],
    company_password: ['', Validators.required]
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
