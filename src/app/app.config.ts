import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Required for forms

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthService } from './services/auth.service'; // CRITICAL: Import the AuthService
// NOTE: Assuming other services like ScheduleService, etc., will be added here or use providedIn: 'root'

export const appConfig: ApplicationConfig = {
    providers: [
        // Core/Advanced Providers
        provideBrowserGlobalErrorListeners(),
        provideClientHydration(withEventReplay()),
        // NOTE: Zoneless change detection is included but should be managed carefully.
        // It's generally best to keep it here if intended.
        provideZonelessChangeDetection(),

        // 1. Routing setup
        provideRouter(routes),

        // 2. HTTP Client and Functional Interceptor Setup
        provideHttpClient(
            withInterceptors([
                jwtInterceptor
            ])
        ),

        // 3. Application Services
        // This explicitly registers AuthService, guaranteeing its availability
        // throughout the application and resolving the 'No suitable injection token' error.
        AuthService,

        // 4. Forms Modules Setup
        // This makes standard Angular modules, which are often needed by external libraries
        // or common built-in components, available globally in the standalone environment.
        importProvidersFrom(FormsModule, ReactiveFormsModule),
    ]
};
