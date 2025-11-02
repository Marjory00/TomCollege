// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { AddEditScheduleComponent } from './components/schedules/add-edit-schedule/add-edit-schedule.component';
import { TeacherListComponent } from './components/teachers/teacher-list/teacher-list.component';
// FIX: Ensure this path is correct, including the final file name
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

// Imported Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'schedules', pathMatch: 'full' },

    // Schedule Management Route (Protected by AuthGuard and RoleGuard)
    {
        path: 'schedules',
        component: SchedulesComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin', 'teacher'] }
    },
    {
        path: 'schedules/add',
        component: AddEditScheduleComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin', 'teacher'] }
    },
    {
        path: 'schedules/edit/:id',
        component: AddEditScheduleComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin', 'teacher'] }
    },

    // Teacher Management Route (Example)
    {
        path: 'teachers',
        component: TeacherListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin'] }
    },

    // Unauthorized Page
    {
        path: 'unauthorized',
        component: UnauthorizedComponent
    },

    // Placeholder for Login (to avoid redirect loops)
    { path: 'login', component: UnauthorizedComponent }, // Use Unauthorized as a temporary login placeholder

    // Catch-all for 404
    { path: '**', redirectTo: 'schedules' }
];
