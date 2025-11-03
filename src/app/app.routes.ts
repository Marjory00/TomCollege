// src/app/app.routes.ts

import { Routes } from '@angular/router';

// 1. PUBLIC COMPONENTS
import { HomeComponent } from './public/home/home.component';
import { AdmissionsComponent } from './public/admissions/admissions.component';
import { FacultyComponent } from './public/faculty/faculty.component';

// 2. FEATURE COMPONENTS
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentsComponent } from './features/students/students.component';
import { CoursesComponent } from './features/courses/courses.component';
import { ProfileComponent } from './features/profile/profile.component';
import { GradesComponent } from './features/grades/grades.component';

// Guard Import
// import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // --- PUBLIC ROUTES (No Guard) ---
  { path: '', component: HomeComponent, title: 'TomCollege - Home' },
  { path: 'admissions', component: AdmissionsComponent, title: 'Admissions' },
  { path: 'faculty', component: FacultyComponent, title: 'Faculty Directory' },
  { path: 'login', component: LoginComponent, title: 'Login' },

  // --- SECURE/DASHBOARD ROUTES (Flat Structure) ---
  // FIX: Flattened routes so they all render directly in the main <router-outlet>
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard Overview'
    // canActivate: [authGuard],
  },
  {
    path: 'students',
    component: StudentsComponent,
    title: 'Student Management'
    // canActivate: [authGuard],
  },
  {
    path: 'courses',
    component: CoursesComponent,
    title: 'Course Catalog'
    // canActivate: [authGuard],
  },
  {
    path: 'grades',
    component: GradesComponent,
    title: 'Grade Report'
    // canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'My Profile'
    // canActivate: [authGuard],
  },
  {
    // Using ProfileComponent for settings
    path: 'settings',
    component: ProfileComponent,
    title: 'Settings'
    // canActivate: [authGuard],
  },

  // --- WILDCARD (404 Not Found) ---
  // Always last: redirects to the public homepage
  { path: '**', redirectTo: '' }
];
