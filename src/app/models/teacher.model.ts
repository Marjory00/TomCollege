// src/app/models/teacher.model.ts

import { User } from './user.model';
// Assuming User and NewUser (from user.model.ts) are correctly structured:

// --- Teacher Interface (extends User) ---
export interface Teacher extends User {
    department: string;
    subject?: string;
    hireDate: string; // The date the teacher was hired
    officeLocation: string;
    adviseeIds: string[]; // List of student IDs they advise
}

// --- NewTeacher Interface (for creation requests) ---
export interface NewTeacher {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    // This property is necessary because the component form includes it
    phone?: string;

    department: string;
    subject?: string;
    officeLocation: string;
    hireDate: string; // Used instead of dateJoined for initial creation
}
