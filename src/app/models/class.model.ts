
// src/app/models/class.model.ts

import { User } from './user.model';
import { Student } from './student.model';

export interface Class {
  _id: string;
  className: string;
  courseCode: string;
  description: string;
  teacher: User | string;
  maxStudents: number;
  enrolledStudents: Array<string | Student>;
  scheduleId?: string;
  status: 'Open' | 'Closed' | 'Archived';
}
