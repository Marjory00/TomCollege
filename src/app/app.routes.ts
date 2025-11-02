import { Routes } from '@angular/router';

// Import components for routing
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentsComponent } from './features/students/students.component';
import { CoursesComponent } from './features/courses/courses.component';

// Define the application routes (must be type Routes)
export const routes: Routes = [
  // Default route redirects to the dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard route
  { path: 'dashboard', component: DashboardComponent },

  // Students feature route
  { path: 'students', component: StudentsComponent },

  // Courses feature route
  { path: 'courses', component: CoursesComponent },

  // Wildcard route for a 404 page (redirect to dashboard for simplicity)
  { path: '**', redirectTo: 'dashboard' }
];
