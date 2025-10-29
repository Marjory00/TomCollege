
// src/app/models/student.model.ts

import { User } from './user.model';

export interface Student {
  _id: string;
  studentId: string; // E.g., S1001
  userId: User; // Reference to the User model (contains name, email, etc.)
  dateOfBirth: Date;
  grade: string;
  major: string;
  enrollmentDate: Date;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Suspended';
}
