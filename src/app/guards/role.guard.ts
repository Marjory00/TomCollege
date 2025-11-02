// src/app/guards/role.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data?.['roles'];

  if (authService.hasRequiredRole(expectedRoles)) {
    return true;
  }

  // Role not allowed, redirect to unauthorized page
  return router.createUrlTree(['/unauthorized']);
};
