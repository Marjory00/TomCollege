import { Routes } from '@angular/router';
// --- RESTORED REQUIRED IMPORTS ---
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// --- Core Components ---
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

// --- Feature Components ---
// Classes
import { ClassesComponent } from './components/classes/classes.component';
import { AddEditClassComponent } from './components/classes/add-edit-class/add-edit-class.component';
// Students
import { StudentsComponent } from './components/students/students.component';
import { StudentFormComponent } from './components/students/student-form/student-form.component'; // Cleaned up import line
// Schedules
import { SchedulesComponent } from './components/schedules/schedules.component';
import { AddEditScheduleComponent } from './components/add-edit-schedule/add-edit-schedule.component';
// Teachers
import { TeachersComponent } from './components/teachers/teachers.component';
import { AddEditTeacherComponent } from './components/teachers/add-edit-teacher/add-edit-teacher.component';


export const routes: Routes = [
    // --- Public Route: Login ---
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    },

    // --- Protected Routes (Requires Authentication) ---

    // Default Redirect: Root path redirects to Dashboard
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    // Dashboard (Main Landing Page)
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        title: 'Dashboard'
    },

    // --- Class Management ---
    {
        path: 'classes',
        children: [
            {
                path: '',
                component: ClassesComponent,
                canActivate: [AuthGuard],
                data: { allowedRoles: ['admin', 'teacher'] },
                title: 'Class List'
            },
            {
                path: 'add',
                component: AddEditClassComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { allowedRoles: ['admin'] },
                title: 'Add Class'
            },
            {
                path: 'edit/:id',
                component: AddEditClassComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { allowedRoles: ['admin'] },
                title: 'Edit Class'
            },
        ]
    },

    // --- Teacher Management ---
    {
        path: 'teachers',
        children: [
            {
                path: '',
                component: TeachersComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { allowedRoles: ['admin'] },
                title: 'Teacher Roster'
            },
            {
                path: 'add',
                component: AddEditTeacherComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { allowedRoles: ['admin'] },
                title: 'Add Teacher'
            },
            {
                path: 'edit/:id',
                component: AddEditTeacherComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { allowedRoles: ['admin'] },
                title: 'Edit Teacher'
            },
        ]
    },

    // --- Schedule Management ---
    {
        path: 'schedules',
        children: [
            {
                path: '',
                component: SchedulesComponent,
                canActivate: [AuthGuard],
                title: 'Schedules'
            },
            {
                path: 'add',
                component: AddEditScheduleComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { allowedRoles: ['admin', 'teacher'] },
                title: 'Add Schedule'
            },
            {
                path: 'edit/:id',
                component: AddEditScheduleComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { allowedRoles: ['admin', 'teacher'] },
                title: 'Edit Schedule'
            },
        ]
    },

    // --- Student Management ---
    {
        path: 'students',
        children: [
            {
                path: '',
                component: StudentsComponent,
                canActivate: [AuthGuard],
                title: 'Student List'
            },
            {
                path: 'add',
                component: StudentFormComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { allowedRoles: ['admin'] },
                title: 'Add Student'
            },
            {
                path: 'edit/:id',
                component: StudentFormComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { allowedRoles: ['admin'] },
                title: 'Edit Student'
            },
        ]
    },

    // --- Wildcard Route (404 Not Found) ---
    {
        path: '**',
        component: NotFoundComponent,
        title: 'Page Not Found'
    },
];
