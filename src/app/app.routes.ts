import { Routes } from '@angular/router';
import { UserTermination } from './components/user-termination/user-termination';
import { Login } from './components/home/login/login';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'dashboard',
        component: UserTermination,
        canActivate: [authGuard]
    }
];
