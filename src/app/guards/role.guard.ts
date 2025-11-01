// src/app/guards/role.guard.ts

import { Injectable, inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const requiredRoles = route.data['allowedRoles'] as Array<string>;

    if (!requiredRoles || requiredRoles.length === 0) {
      // If no roles are specified, allow access
      return true;
    }

    if (authService.hasRequiredRole(requiredRoles)) {
      return true;
    }

    // Role is not permitted, redirect to dashboard or access denied page
    router.navigate(['/dashboard']);
    alert('Access Denied: You do not have the required permissions.');
    return false;
  };
}

export const canActivateRole: CanActivateFn = (route, state) => {
    return inject(RoleGuard).canActivate(route, state);
};
