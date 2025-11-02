import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentsComponent } from './features/students/students.component';
import { CoursesComponent } from './features/courses/courses.component';
import { ProfileComponent } from './features/profile/profile.component'; // New Import
import { GradesComponent } from './features/grades/grades.component';     // New Import

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'profile', component: ProfileComponent }, // New Route
  { path: 'grades', component: GradesComponent },   // New Route
  { path: '**', redirectTo: 'dashboard' }
];
