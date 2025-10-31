import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Required for forms

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthService } from './services/auth.service'; // CRITICAL: Import the AuthService

export const appConfig: ApplicationConfig = {
  providers: [
    // Core/Advanced Providers
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),

    // 1. Routing setup
    provideRouter(routes),

    // 2. HTTP Client and Functional Interceptor Setup
    provideHttpClient(
      withInterceptors([
        jwtInterceptor
      ])
    ),

    // 3. Application Services
    // FIX 1: Explicitly provide AuthService to guarantee resolution of its token,
    // solving the 'No suitable injection token' error.
    AuthService,
    // You may also list other root services like StudentService, TeacherService here

    // 4. Forms Modules Setup
    // FIX 2: Use importProvidersFrom to make standard Angular modules available globally
    importProvidersFrom(FormsModule, ReactiveFormsModule),

    // NOTE: Zoneless change detection is left in but should be managed carefully.
    provideZonelessChangeDetection(),
  ]
};
