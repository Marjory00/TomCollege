
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is authenticated
  if (authService.isAuthenticated()) {
    return true; // Access granted
  } else {
    // If not authenticated, redirect them to the login page
    alert('Access Denied. Please log in to view the dashboard.');
    return router.createUrlTree(['/login']);
  }
};
