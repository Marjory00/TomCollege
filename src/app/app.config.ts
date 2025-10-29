// src/app/app.config.ts

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // ⬅️ NEW: HTTP Client
import { provideForms, withReactiveForms } from '@angular/forms'; // ⬅️ NEW: Forms

import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // ⬅️ Import your Interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    // Core/Advanced Providers (kept from your original code)
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideForms(withReactiveForms()),

    // 1. Routing setup
    provideRouter(routes),

    // 2. 🚨 FIX: HTTP Client and Interceptor Setup
    provideHttpClient(
      withInterceptors([
        AuthInterceptor // Registers your JWT token interceptor
      ])
    ),

    // 3. 🚨 FIX: Forms Setup (required for [formGroup] and other form directives)
    provideForms(withReactiveForms()),

    // Note: All services with { providedIn: 'root' } are automatically available.
  ]
};
