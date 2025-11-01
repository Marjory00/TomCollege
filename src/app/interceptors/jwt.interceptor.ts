// src/app/interceptors/jwt.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUserValue;
  const isLoggedIn = currentUser && currentUser.token;

  // Skip token attachment for login/registration calls
  const isApiUrl = req.url.startsWith(authService['apiUrl']);
  const isAuthUrl = req.url.includes('/login') || req.url.includes('/register');

  if (isLoggedIn && isApiUrl && !isAuthUrl) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
  }

  return next(req);
};
