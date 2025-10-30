// src/app/interceptors/auth.interceptor.ts

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    const authReq = token
        ? req.clone({
              setHeaders: {
                  Authorization: `Bearer ${token}`
              }
          })
        : req;

    return next(authReq).pipe(
        catchError(error => {
            if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
                console.warn(`Auth error (${error.status}) on ${req.url}. Redirecting to login.`);
                authService.logout(); // SSR-safe logout
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};

