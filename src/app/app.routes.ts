import { Routes } from '@angular/router';

// Public Imports
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './public/home/home.component';
import { AdmissionsComponent } from './public/admissions/admissions.component';
import { FacultyComponent } from './public/faculty/faculty.component';

// Secure/Dashboard Imports
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentsComponent } from './features/students/students.component';
import { CoursesComponent } from './features/courses/courses.component';
import { ProfileComponent } from './features/profile/profile.component';
import { GradesComponent } from './features/grades/grades.component';

// Guard Import: Uncomment the import and the 'canActivate' line below to enable security
// import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // --- PUBLIC ROUTES (No layout/sidebar required) ---
  { path: '', component: HomeComponent, title: 'TomCollege - Home' }, // Loads the main website page
  { path: 'admissions', component: AdmissionsComponent, title: 'Admissions' },
  { path: 'faculty', component: FacultyComponent, title: 'Faculty Directory' },
  { path: 'login', component: LoginComponent, title: 'Login' },

  // --- SECURE/DASHBOARD ROUTES GROUP ---
  {
    path: 'dashboard',
    // canActivate: [AuthGuard], // <-- UNCOMMENT THIS LINE TO RE-ENABLE LOGIN PROTECTION
    children: [
      { path: '', component: DashboardComponent, title: 'Dashboard Overview' }, // /dashboard
      { path: 'students', component: StudentsComponent, title: 'Student Management' }, // /dashboard/students
      { path: 'courses', component: CoursesComponent, title: 'Course Catalog' }, // /dashboard/courses
      { path: 'profile', component: ProfileComponent, title: 'My Profile' }, // /dashboard/profile
      { path: 'grades', component: GradesComponent, title: 'Grade Report' }, // /dashboard/grades
      { path: 'settings', component: ProfileComponent, title: 'Settings' }
    ]
  },

  // Wildcard route redirects back to the public homepage
  { path: '**', redirectTo: '' }
];
