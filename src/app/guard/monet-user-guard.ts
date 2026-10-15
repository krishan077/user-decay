import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const monetUserGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  if(localStorage.getItem('monet-user') && localStorage.getItem('token')){
      return true;
    }
    else{
      router.navigate(['/'])
      return false;
    }
};
