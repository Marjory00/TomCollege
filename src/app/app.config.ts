import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt.interceptor'; // Assuming the interceptor file is correctly defined

export const appConfig: ApplicationConfig = {
  providers: [
    // Core/Advanced Providers
    provideBrowserGlobalErrorListeners(),
    // NOTE: provideZonelessChangeDetection should only be used if intentionally adopting the zoneless architecture.
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),

    // 1. Routing setup
    provideRouter(routes),

    // 2. HTTP Client and Functional Interceptor Setup
    provideHttpClient(
      withInterceptors([
        // Registers the functional JWT interceptor to attach the token to API requests.
        jwtInterceptor
      ])
    ),

    // 3. Forms Setup is handled by importing ReactiveFormsModule in standalone components.
    // No additional providers needed here.
  ]
};
