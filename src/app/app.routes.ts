// src/app/app.routes.ts

import { Routes } from '@angular/router';

// 1. PUBLIC COMPONENTS (KEEP)
import { HomeComponent } from './public/home/home.component';
import { AdmissionsComponent } from './public/admissions/admissions.component';
import { FacultyComponent } from './public/faculty/faculty.component';

// 2. FEATURE COMPONENTS (KEEP)
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component'; // THIS IS NOW THE LAYOUT SHELL
import { StudentsComponent } from './features/students/students.component';
import { CoursesComponent } from './features/courses/courses.component';
import { ProfileComponent } from './features/profile/profile.component';
import { GradesComponent } from './features/grades/grades.component';
import { SettingsComponent } from './features/settings/settings.component'; // Assuming you have a Settings component

// Guard Import
// import { authGuard } from './core/guards/auth.guard';

// REMOVED: import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
    // --- PUBLIC ROUTES (KEEP) ---
    { path: '', component: HomeComponent, title: 'TomCollege - Home' },
    { path: 'admissions', component: AdmissionsComponent, title: 'Admissions' },
    { path: 'faculty', component: FacultyComponent, title: 'Faculty Directory' },
    { path: 'login', component: LoginComponent, title: 'Login' },

    // --- SECURE/DASHBOARD ROUTES (FIXED: DashboardComponent is the shell) ---
    {
        path: 'dashboard',
        component: DashboardComponent, // FIX: Using your existing DashboardComponent as the Shell
        // canActivate: [authGuard],

        // ALL SIDEBAR LINKS ARE CHILDREN
        children: [
            // Link: /dashboard (The base path content)
            {
                path: '',
                component: GradesComponent, // NOTE: Using GradesComponent as a temporary placeholder for Dashboard Overview content
                title: 'Dashboard Overview'
            },

            // Link: /dashboard/students
            {
                path: 'students',
                component: StudentsComponent,
                title: 'Student Management'
            },

            // Link: /dashboard/courses
            {
                path: 'courses',
                component: CoursesComponent,
                title: 'Course Catalog'
            },

            // Link: /dashboard/grades
            {
                path: 'grades',
                component: GradesComponent,
                title: 'Grade Report'
            },

            // Link: /dashboard/profile
            {
                path: 'profile',
                component: ProfileComponent,
                title: 'My Profile'
            },

            // Link: /dashboard/settings
            {
                path: 'settings',
                component: SettingsComponent, // Assuming you have a SettingsComponent
                title: 'Settings'
            },

            // OPTIONAL: Local fallback for unmatched /dashboard/xyz paths
            { path: '**', redirectTo: '' }
        ]
    },

    // --- WILDCARD (404 Not Found) ---
    { path: '**', redirectTo: '' }
];
