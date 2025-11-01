import { Routes } from '@angular/router';

// --- Guards ---
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// --- Core Components ---
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

// --- Feature Components ---
// Classes
import { ClassesComponent } from './components/classes/classes.component';
import { AddEditClassComponent } from './components/classes/add-edit-class/add-edit-class.component';
// Students
import { StudentsComponent } from './components/students/students.component';
import { StudentFormComponent } from './components/students/student-form/student-form.component';
// Schedules
import { SchedulesComponent } from './components/schedules/schedules.component';
import { AddEditScheduleComponent } from './components/schedules/add-edit-schedule/add-edit-schedule.component';
// Teachers
import { TeachersComponent } from './components/teachers/teachers.component';
import { AddEditTeacherComponent } from './components/teachers/add-edit-teacher/add-edit-teacher.component';


export const routes: Routes = [
    // 1. Public Route: Login
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    },

    // 2. Protected Routes Shell (Layout)
    {
        path: '',
        component: LayoutComponent, // This component provides the header/sidebar
        canActivate: [AuthGuard], // AuthGuard protects the entire shell
        children: [
            // Default Redirect: Root path redirects to Dashboard
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

            // Dashboard
            {
                path: 'dashboard',
                component: DashboardComponent,
                title: 'Dashboard'
            },

            // --- Class Management ---
            {
                path: 'classes',
                children: [
                    {
                        path: '',
                        component: ClassesComponent,
                        data: { allowedRoles: ['admin', 'teacher', 'student'] },
                        title: 'Class List'
                    },
                    {
                        path: 'add',
                        component: AddEditClassComponent,
                        canActivate: [RoleGuard],
                        data: { allowedRoles: ['admin'] },
                        title: 'Add Class'
                    },
                    {
                        path: 'edit/:id',
                        component: AddEditClassComponent,
                        canActivate: [RoleGuard],
                        data: { allowedRoles: ['admin'] },
                        title: 'Edit Class'
                    },
                ]
            },

            // --- Teacher Management (Admin Only) ---
            {
                path: 'teachers',
                children: [
                    {
                        path: '',
                        component: TeachersComponent,
                        canActivate: [RoleGuard],
                        data: { allowedRoles: ['admin'] },
                        title: 'Teacher Roster'
                    },
                    {
                        path: 'add',
                        component: AddEditTeacherComponent,
                        canActivate: [RoleGuard],
                        data: { allowedRoles: ['admin'] },
                        title: 'Add Teacher'
                    },
                    {
                        path: 'edit/:id',
                        component: AddEditTeacherComponent,
                        canActivate: [RoleGuard],
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
                        title: 'Schedules'
                    },
                    {
                        path: 'add',
                        component: AddEditScheduleComponent,
                        canActivate: [RoleGuard],
                        data: { allowedRoles: ['admin', 'teacher'] },
                        title: 'Add Schedule'
                    },
                    {
                        path: 'edit/:id',
                        component: AddEditScheduleComponent,
                        canActivate: [RoleGuard],
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
                        title: 'Student List'
                    },
                    {
                        path: 'add',
                        component: StudentFormComponent,
                        canActivate: [RoleGuard],
                        data: { allowedRoles: ['admin'] },
                        title: 'Add Student'
                    },
                    {
                        path: 'edit/:id',
                        component: StudentFormComponent,
                        canActivate: [RoleGuard],
                        data: { allowedRoles: ['admin'] },
                        title: 'Edit Student'
                    },
                ]
            },
        ]
    },

    // 3. Wildcard Route (404/Fallback)
    {
        path: '404',
        component: NotFoundComponent,
        title: 'Page Not Found'
    },
    // Final catch-all redirect to the 404 page
    { path: '**', redirectTo: '/404' }
];
