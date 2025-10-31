import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/**
 * Checks if a user is currently logged in.
 * If not, it redirects the user to the login page.
 */
export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // Use Angular's inject function to get the required services in a functional guard
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUserValue;

  if (currentUser) {
    // User is logged in, allow access to the route
    return true;
  }

  // User is NOT logged in, redirect to the login page
  // Capture 'state.url' as a query parameter for post-login redirect
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
