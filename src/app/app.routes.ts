import { Routes } from '@angular/router';

// --- PUBLIC IMPORTS ---
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './public/home/home.component';
import { AdmissionsComponent } from './public/admissions/admissions.component';
import { FacultyComponent } from './public/faculty/faculty.component';

// --- SECURE/DASHBOARD IMPORTS ---
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentsComponent } from './features/students/students.component';
import { CoursesComponent } from './features/courses/courses.component';
import { ProfileComponent } from './features/profile/profile.component';
import { GradesComponent } from './features/grades/grades.component';


export const routes: Routes = [
  // --- PUBLIC ROUTES (No layout/sidebar required) ---
  { path: '', component: HomeComponent, title: 'TomCollege - Home' },
  { path: 'admissions', component: AdmissionsComponent, title: 'Admissions' },
  { path: 'faculty', component: FacultyComponent, title: 'Faculty Directory' },
  { path: 'login', component: LoginComponent, title: 'Login' },

  // --- SECURE/DASHBOARD ROUTES GROUP ---
  // The 'dashboard' segment acts as the entry point for all secure routes.
  // This structure makes implementing an AuthGuard simpler later.
  {
    path: 'dashboard',
    // Note: The DashboardComponent will be the default page for /dashboard
    children: [
      { path: '', component: DashboardComponent, title: 'Dashboard Overview' }, // /dashboard
      { path: 'students', component: StudentsComponent, title: 'Student Management' }, // /dashboard/students
      { path: 'courses', component: CoursesComponent, title: 'Course Catalog' }, // /dashboard/courses
      { path: 'profile', component: ProfileComponent, title: 'My Profile' }, // /dashboard/profile
      { path: 'grades', component: GradesComponent, title: 'Grade Report' }, // /dashboard/grades
    ]
  },

  // Wildcard route redirects back to the public homepage
  { path: '**', redirectTo: '' }
];
