import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUserValue; // Get the full user object

  // 1. CRITICAL FIX: Get the token from the user object, not a missing getToken() method
  const token = currentUser?.token;

  // Check if the user is logged in AND the request is to your API (not a third party)
  const isApiUrl = req.url.startsWith(environment.apiUrl);

  // If the user is logged in and the token exists, attach it to the request
  if (currentUser && token && isApiUrl) {
    // Clone the request and add the Authorization header
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
