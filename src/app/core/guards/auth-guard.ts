import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {

  const _authService = inject(Auth);
  const _Router = inject(Router);
  const _PLATFORM_ID=inject(PLATFORM_ID)
  const currentUser = _authService.getCurrentUser();

  // if (!_authService.isLoggedIn()) {
  //   _Router.navigate(['/']);
  //   return false;
  // }
  // const expectedRole = route.data['role'];
  // if (expectedRole && currentUser?.role !== expectedRole) {
   
  //   _Router.navigate(['/']);
  //   return false;
  // }
  // return true;
  if(isPlatformBrowser(_PLATFORM_ID)){
     if (!_authService.isLoggedIn()) {
    _Router.navigate(['/login']);
    return false;
  }
  const expectedRole = route.data['role'];
  if (expectedRole && currentUser?.role !== expectedRole) {
   
    _Router.navigate(['/login']);
    return false;
  }
  return true;
  }
  else{
    return false;
  } 
};
