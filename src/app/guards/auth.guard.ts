import { Injectable } from '@angular/core';
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
  // The 'state.url' is captured as a query parameter so the user can be redirected back
  // after a successful login (a standard practice for user experience).
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

// Note: If you are using an older Angular version (< v15), you would use the class-based guard:
/*
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      return true;
    }

    // Redirect to login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
*/
