// src/app/models/student.model.ts

import { User } from './user.model';

export interface Student extends User {
    major: string;
    gpa: number;
    enrollmentDate: string;
    advisorId: string; // ID of the teacher who is the advisor
}
