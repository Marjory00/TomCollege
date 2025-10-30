// src/app/app.routes.ts

import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// --- Feature Components ---
import { ClassesComponent } from './components/classes/classes.component';
import { AddEditClassComponent } from './components/classes/add-edit-class/add-edit-class.component'; // <-- NEW IMPORT
import { StudentsComponent } from './components/students/students.component';
import { SchedulesComponent } from './components/schedules/schedules.component';

// --- Guards ---
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';


export const routes: Routes = [
  // Public Route
  { path: 'login', component: LoginComponent },

  // --- Protected Routes ---
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  // 1. Class Management Routes
  {
    path: 'classes',
    component: ClassesComponent, // Component to list all classes
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'teacher'] }
  },
  {
    path: 'classes/add', // Route for adding a new class
    component: AddEditClassComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'teacher'] }
  },
  {
    path: 'classes/edit/:id', // Route for editing an existing class
    component: AddEditClassComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'teacher'] }
  },

  // 2. Student Management Routes
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },

  // 3. Schedule Management Routes
  {
    path: 'schedules',
    component: SchedulesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'teacher'] }
  },

  // Default Redirects
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
