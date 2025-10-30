// src/app/app.routes.ts

import { Routes } from '@angular/router';

// import { LoginComponent } from './components/login/login.component'; // Commented out the import, too
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddEditClassComponent } from './components/classes/add-edit-class/add-edit-class.component';
import { ClassesComponent } from './components/classes/classes.component';
import { StudentsComponent } from './components/students/students.component';
import { SchedulesComponent } from './components/schedules/schedules.component';

// import { AuthGuard } from './guards/auth.guard'; // Commented out
// import { RoleGuard } from './guards/role.guard'; // Commented out


export const routes: Routes = [

  //  FIX 3: REMOVED the login route entry entirely.
  // { path: 'login', component: LoginComponent },

  // --- Main Application Routes (No Guards for Mockup) ---
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthGuard] // Commented out
  },
  {
    path: 'classes',
    component: ClassesComponent,
    // canActivate: [AuthGuard, RoleGuard], // Commented out
    data: { roles: ['admin', 'teacher'] }
  },
  {
    path: 'classes/add',
    component: AddEditClassComponent,
    // canActivate: [AuthGuard, RoleGuard], // Commented out
    data: { roles: ['admin', 'teacher'] }
  },
  {
    path: 'classes/edit/:id',
    component: AddEditClassComponent,
    // canActivate: [AuthGuard, RoleGuard], // Commented out
    data: { roles: ['admin', 'teacher'] }
  },
  {
    path: 'students',
    component: StudentsComponent,
    // canActivate: [AuthGuard, RoleGuard], // Commented out
    data: { roles: ['admin'] }
  },
  {
    path: 'schedules',
    component: SchedulesComponent,
    // canActivate: [AuthGuard, RoleGuard], // Commented out
    data: { roles: ['admin', 'teacher'] }
  },

  // --- Default Redirect ---
  // FIX 4: Ensure the root path and any bad path goes directly to the dashboard.
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
