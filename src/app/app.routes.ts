// src/app/app.routes.ts

import { Routes } from '@angular/router';

// 1. PUBLIC COMPONENTS
import { HomeComponent } from './public/home/home.component';
import { AdmissionsComponent } from './public/admissions/admissions.component';
import { FacultyComponent } from './public/faculty/faculty.component';

// FIX: Ensure the import path for the new public shell is correct
import { LayoutComponent } from './public/layout/layout.component';

// 2. FEATURE COMPONENTS
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentsComponent } from './features/students/students.component';
import { CoursesComponent } from './features/courses/courses.component';
import { ProfileComponent } from './features/profile/profile.component';
import { GradesComponent } from './features/grades/grades.component';
import { SettingsComponent } from './features/settings/settings.component';

// Guard Import
// import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // --- PUBLIC ROUTES (Nested under Public Layout Shell) ---
    {
        path: '',
        component: LayoutComponent, // The Public Layout Shell
        children: [
            // Base URL: /
            { path: '', component: HomeComponent, title: 'TomCollege - Home' },
            // Path: /admissions
            { path: 'admissions', component: AdmissionsComponent, title: 'Admissions' },
            // Path: /faculty
            { path: 'faculty', component: FacultyComponent, title: 'Faculty Directory' },
            // Path: /login
            { path: 'login', component: LoginComponent, title: 'Login' }
        ]
    },

    // --- SECURE/DASHBOARD ROUTES (Nested under Dashboard Layout Shell) ---
    {
        path: 'dashboard',
        component: DashboardComponent, // The Secure Dashboard Shell
        // canActivate: [authGuard],

        children: [
            // Path: /dashboard (Temporary placeholder fix to stop redirects)
            { path: '', component: ProfileComponent, title: 'Dashboard Overview' },

            // Other secure paths...
            { path: 'students', component: StudentsComponent, title: 'Student Management' },
            { path: 'courses', component: CoursesComponent, title: 'Course Catalog' },
            { path: 'grades', component: GradesComponent, title: 'Grade Report' },
            { path: 'profile', component: ProfileComponent, title: 'My Profile' },
            { path: 'settings', component: SettingsComponent, title: 'Settings' },

            { path: '**', redirectTo: '' }
        ]
    },

    // --- WILDCARD (404 Not Found) ---
    { path: '**', redirectTo: '' }
];
