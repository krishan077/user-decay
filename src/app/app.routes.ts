import { Routes } from '@angular/router';
import { Login } from './components/home/login/login';
import { authGuard } from './guard/auth-guard';
import { Dashboard } from './components/dashboard/dashboard';
import { CompanyList } from './components/dashboard/company-list/company-list';
import { monetUserGuard } from './guard/monet-user-guard';
import { StudyList } from './components/dashboard/study-list/study-list';
import { UserTermination } from './components/dashboard/user-termination/user-termination';
import { Waterfall } from './components/dashboard/user-termination/waterfall/waterfall';

export const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      {
        path: 'company-list',
        component: CompanyList,
        canActivate: [monetUserGuard]
      },
      {
        path: 'study-list',
        component: StudyList,
        canActivate: [authGuard]
      },
      {
        path: 'user-termination',
        component: UserTermination,
        canActivate: [authGuard],
        children: [
          {
            path: 'overview',
            component: Waterfall,
            canActivate: [authGuard]
          },
          {
            path: 'questions',
            component: StudyList,
            canActivate: [authGuard]
          },
          {
            path: 'respondents',
            component: UserTermination,
            canActivate: [authGuard]
          },
        ]
      },
    ]
  }
];
