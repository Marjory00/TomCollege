// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentListComponent } from './components/students/student-list/student-list.component';
import { AuthGuard } from './guards/auth.guard'; // Assume this guard exists
import { RoleGuard } from './guards/role.guard'; // Assume this guard exists

export const routes: Routes = [
  // Authentication routes
  { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent }, // (Optional)

  // Main application routes (Protected by AuthGuard)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // Protects the entire application layout
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },

      // Student Routes (Admin/Teacher only for management)
      {
        path: 'students',
        component: StudentListComponent,
        title: 'Student Roster',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin', 'teacher'] }
      },
      // Assuming a separate component for Add/Edit
      {
        path: 'students/add',
        loadComponent: () => import('./components/students/add-edit-student/add-edit-student.component').then(m => m.AddEditStudentComponent),
        title: 'Add Student',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin'] }
      },
      {
        path: 'students/edit/:id',
        loadComponent: () => import('./components/students/add-edit-student/add-edit-student.component').then(m => m.AddEditStudentComponent),
        title: 'Edit Student',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin', 'teacher'] } // Teachers can edit their students
      },

      // Teacher Routes (Admin only)
      {
        path: 'teachers',
        loadComponent: () => import('./components/teachers/teacher-list/teacher-list.component').then(m => m.TeacherListComponent),
        title: 'Teacher Roster',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin'] }
      },
      // Note: We already built the AddEditTeacherComponent
      {
        path: 'teachers/add',
        loadComponent: () => import('./components/teachers/add-edit-teacher/add-edit-teacher.component').then(m => m.AddEditTeacherComponent),
        title: 'Add Teacher',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin'] }
      },
      {
        path: 'teachers/edit/:id',
        loadComponent: () => import('./components/teachers/add-edit-teacher/add-edit-teacher.component').then(m => m.AddEditTeacherComponent),
        title: 'Edit Teacher',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin'] }
      },

      // Placeholder routes (Schedule, Classes, Settings)
      {
        path: 'schedule',
        loadComponent: () => import('./components/placeholder/schedule/schedule.component').then(m => m.ScheduleComponent),
        title: 'My Schedule',
      },
      {
        path: 'classes',
        loadComponent: () => import('./components/placeholder/classes/classes.component').then(m => m.ClassesComponent),
        title: 'Classes',
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/placeholder/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin'] }
      },
    ],
  },

  // Wildcard route for 404
  { path: '**', redirectTo: '/dashboard' },
];
