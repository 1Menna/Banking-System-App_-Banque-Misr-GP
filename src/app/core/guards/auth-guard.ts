import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {

  const _authService = inject(Auth);
  const _Router = inject(Router);

  if (!_authService.isLoggedIn()) {
    _Router.navigate(['/login']);
    return false;
  }
  return true;
};
