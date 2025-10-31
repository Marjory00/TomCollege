import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/**
 * Checks if the logged-in user has one of the roles allowed for the route.
 * If not, it redirects the user to the dashboard.
 */
export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // Use Angular's inject function to get the required services
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Get the roles allowed for this specific route from the route data
  // The route data is expected to contain { allowedRoles: ['admin', 'teacher'] }
  const allowedRoles = route.data['allowedRoles'] as string[];

  // Defense against undefined configuration (shouldn't happen if routes are set up correctly)
  if (!allowedRoles || allowedRoles.length === 0) {
    console.warn('RoleGuard blocked access: No allowedRoles defined for this route.');
    router.navigate(['/dashboard']);
    return false;
  }

  // 2. Check if the current user's role is included in the allowed roles
  if (authService.hasRequiredRole(allowedRoles)) {
    // Role is authorized, grant access
    return true;
  }

  // 3. Role is NOT authorized, redirect to the dashboard
  const userRole = authService.currentUserValue?.role || 'Guest';
  console.warn(`RoleGuard blocked access: User role '${userRole}' not authorized for required roles [${allowedRoles.join(', ')}].`);
  router.navigate(['/dashboard']);
  return false;
};
