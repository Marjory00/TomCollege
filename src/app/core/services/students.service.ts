// src/app/cores/services/students.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// FIXED: Correct path to singular 'core' folder from 'cores/services'
import { Student } from '../../core/models/student.model';

// ✅ Mock student data for development and onboarding walkthroughs
const MOCK_STUDENTS: Student[] = [
  { id: 1001, firstName: 'Liam', lastName: "O'Connell", major: 'Astrophysics', enrollmentDate: '2023-09-01', status: 'Active' },
  { id: 1002, firstName: 'Olivia', lastName: 'Vargas', major: 'Mechanical Engineering', enrollmentDate: '2022-01-15', status: 'Active' },
  { id: 1003, firstName: 'Noah', lastName: 'Patel', major: 'Computer Science', enrollmentDate: '2021-09-01', status: 'Active' },
  { id: 1004, firstName: 'Emma', lastName: 'Chen', major: 'History', enrollmentDate: '2024-01-05', status: 'On Leave' },
  { id: 1005, firstName: 'Sophia', lastName: 'Katz', major: 'Biology', enrollmentDate: '2022-09-01', status: 'Graduated' }
];

@Injectable({
  providedIn: 'root' // ✅ Global service injection
})
export class StudentsService {

  /** Returns a mock list of students as an Observable. */
  getStudents(): Observable<Student[]> {
    return of(MOCK_STUDENTS);
  }
}
