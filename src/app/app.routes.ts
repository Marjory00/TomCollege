// src/app/app.routes.ts

import { Routes } from '@angular/router';

// 1. PUBLIC LAYOUT AND COMPONENTS
import { HomeComponent } from './public/home/home.component';
import { AdmissionsComponent } from './public/admissions/admissions.component';
import { FacultyComponent } from './public/faculty/faculty.component';

// 2. FEATURE COMPONENTS (Used across public/secure)
import { LoginComponent } from './features/login/login.component';

// 3. SECURE/DASHBOARD COMPONENTS
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentsComponent } from './features/students/students.component';
import { CoursesComponent } from './features/courses/courses.component';
import { ProfileComponent } from './features/profile/profile.component';
import { GradesComponent } from './features/grades/grades.component';

// Guard Import: Uncomment the import and the 'canActivate' line below to enable security
// import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // --- PUBLIC ROUTES ---
  { path: '', component: HomeComponent, title: 'TomCollege - Home' },
  { path: 'admissions', component: AdmissionsComponent, title: 'Admissions' },
  { path: 'faculty', component: FacultyComponent, title: 'Faculty Directory' },
  { path: 'login', component: LoginComponent, title: 'Login' },

  // 🟢 FIX: Removed the separator line that caused the TS2559 error

  // --- SECURE/DASHBOARD ROUTES GROUP ---
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        // Using DashboardComponent for the content and layout shell
        component: DashboardComponent,
        title: 'Dashboard Overview'
      },
      {
        path: 'students',
        component: StudentsComponent,
        title: 'Student Management'
      },
      {
        path: 'courses',
        component: CoursesComponent,
        title: 'Course Catalog'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'My Profile'
      },
      {
        path: 'grades',
        component: GradesComponent,
        title: 'Grade Report'
      },
      {
        // Using ProfileComponent for settings since SettingsComponent does not exist
        path: 'settings',
        component: ProfileComponent,
        title: 'Settings'
      }
    ]
  },

  // 🟢 FIX: Removed the separator line that caused the TS2559 error

  // Wildcard route redirects back to the public homepage
  { path: '**', redirectTo: '' }
];
