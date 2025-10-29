// src/app/app.routes.ts

import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClassesComponent } from './components/classes/classes.component';
import { StudentsComponent } from './components/students/students.component';
import { SchedulesComponent } from './components/schedules/schedules.component';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// NOTE: You would typically define routes for Add/Edit components here too (e.g., /classes/add, /classes/edit/:id)

export const routes: Routes = [
  // Public Route
  { path: 'login', component: LoginComponent },

  // Protected Routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'classes',
    component: ClassesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'teacher'] }
  },
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
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
