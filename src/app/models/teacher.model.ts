// src/app/models/teacher.model.ts

import { User, NewUser } from './user.model';

// Specific status types for a Teacher
export type TeacherStatus = 'Active' | 'Suspended' | 'On Leave' | 'Retired';

export interface Teacher extends Omit<User, 'status'> {
    role: 'teacher';
    department: string;
    subject: string;
    status: TeacherStatus;
}

export interface NewTeacherData extends Omit<NewUser, 'role'> {
    role: 'teacher';
    department: string;
    subject: string;
    status: TeacherStatus;
}
