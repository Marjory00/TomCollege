// src/app/app.config.ts

import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';

// Import Services and Guards (Ensuring all dependencies are provided)
import { AuthService } from './services/auth.service';
import { StudentService } from './services/student.service';
import { TeacherService } from './services/teacher.service';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 1. ROUTING
    provideRouter(routes),

    // 2. HTTP CLIENT (CRITICAL FIX)
    provideHttpClient(),

    // 3. FORMS
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule
    ),

    // 4. APPLICATION SERVICES (Provided for DI)
    AuthService,
    StudentService,
    TeacherService,
    // 5. GUARDS (Provided for DI)
    AuthGuard,
    RoleGuard,
  ]
};
