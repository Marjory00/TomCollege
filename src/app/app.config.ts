// src/app/app.config.ts (Final Fixed Configuration)

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// 🚨 FIX: DELETE OR COMMENT OUT THE LINE BELOW
// import { provideForms, withReactiveForms } from '@angular/forms';

import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Core/Advanced Providers
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),

    // 1. Routing setup
    provideRouter(routes),

    // 2. HTTP Client and Functional Interceptor Setup
    provideHttpClient(
      withInterceptors([
        AuthInterceptor
      ])
    ),

    // 3. 🚨 FIX: Forms Setup is NOW HANDLED by importing ReactiveFormsModule in the components.
  ]
};
