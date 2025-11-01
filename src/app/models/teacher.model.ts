// src/app/models/teacher.model.ts (Updated)

import { User } from './user.model';

/**
 * Extends the base User model with teacher-specific properties.
 */
export interface Teacher extends User {
dateJoined: string|number|Date;
    role: 'teacher' | 'admin';
    subject: string;
    department: string;
    status: 'Active' | 'Suspended' | 'On Leave' | 'Retired';
    officeNumber?: string;
}

/**
 * FIX: Define the required interface for adding a new teacher.
 * This includes the 'password' but omits auto-generated fields like 'id' and 'dateJoined'.
 */
export interface NewTeacherData extends Omit<Teacher, 'id' | 'dateJoined'> {
    password: string;
}
