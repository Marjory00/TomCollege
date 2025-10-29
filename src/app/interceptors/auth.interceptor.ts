// src/app/interceptors/auth.interceptor.ts (Verified and Finalized)

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http'; // Added HttpErrorResponse for type safety
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Export a constant that implements the HttpInterceptorFn type
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    // 1. Dependency Injection (must use inject() outside of class constructor)
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    // 2. Clone request if token exists
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    // 3. Handle the request and catch 401/403 errors
    return next(req).pipe(
        catchError(error => {
            // Check if the error is an HTTP error response
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401 || error.status === 403) {
                    console.warn('Unauthorized or Forbidden response received. Redirecting to login.');

                    // Log out the user and redirect to login if unauthorized
                    // NOTE: logout() must be SSR-safe, which we fixed in auth.service.ts
                    authService.logout();
                    router.navigate(['/login']);
                }
            }
            // Always re-throw the original error
            return throwError(() => error);
        })
    );
};
