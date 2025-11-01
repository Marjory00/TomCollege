// src/app/guards/auth.guard.ts

import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
      return true;
    }

    // Not logged in, redirect to login page
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  };
}

export const canActivateAuth: CanActivateFn = (route, state) => {
    return inject(AuthGuard).canActivate(route, state);
};
