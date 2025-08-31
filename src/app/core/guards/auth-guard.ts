import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { isPlatformBrowser } from '@angular/common';

  export const authGuard: CanActivateFn = (route, state) => {
  const _authService = inject(Auth);
  const _Router = inject(Router);
  const _PLATFORM_ID = inject(PLATFORM_ID);

  if (isPlatformBrowser(_PLATFORM_ID)) {
    if (!_authService.isLoggedIn()) {
      return _Router.createUrlTree(['/login']);
    }

    const currentUser = _authService.getCurrentUser();
    const expectedRole = route.data['role'];

    if (expectedRole && currentUser?.role !== expectedRole) {
      return _Router.createUrlTree(['/']);
    }

    return true;
  }

  
  return true;
};



