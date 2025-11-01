// src/app/models/student.model.ts

import { User, NewUser } from './user.model';

// Define the specific status types for a Student (includes "On Probation" fix)
export type StudentStatus = 'Active' | 'Graduated' | 'Withdrawn' | 'Suspended' | 'On Probation';

export interface Student extends Omit<User, 'status'> {
gradeLevel: any;
    role: 'student';
    studentId: string;
    currentClass: string;
    enrollmentDate: string;
    status: StudentStatus;
}

export interface NewStudentData extends Omit<NewUser, 'role'> {
    role: 'student';
    studentId: string;
    currentClass: string;
    enrollmentDate: string;
    status: StudentStatus;
}
