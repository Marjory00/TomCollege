import { Routes } from '@angular/router';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { AddEditScheduleComponent } from './components/schedules/add-edit-schedule/add-edit-schedule.component';
import { TeacherListComponent } from './components/teachers/teacher-list/teacher-list.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'schedules', pathMatch: 'full' },
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
    {
        path: 'teachers',
        component: TeacherListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent
    },
    { path: 'login', component: UnauthorizedComponent },
    { path: '**', component: NotFoundComponent } // Consider using a NotFoundComponent
];
