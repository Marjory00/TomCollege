// src/app/core/services/students.service.ts  👈 FIX 2: Corrected folder name in path comment

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// FIXED: Corrected path from 'cores/services' to 'core/services'
import { Student } from '../../core/models/student.model';

// ✅ Mock student data for development and onboarding walkthroughs
const MOCK_STUDENTS: Student[] = [
  // FIX 1: Added the required 'name' property to match the Student interface
  { id: 1001, name: "Liam O'Connell", firstName: 'Liam', lastName: "O'Connell", major: 'Astrophysics', enrollmentDate: '2023-09-01', status: 'Active' },
  { id: 1002, name: 'Olivia Vargas', firstName: 'Olivia', lastName: 'Vargas', major: 'Mechanical Engineering', enrollmentDate: '2022-01-15', status: 'Active' },
  { id: 1003, name: 'Noah Patel', firstName: 'Noah', lastName: 'Patel', major: 'Computer Science', enrollmentDate: '2021-09-01', status: 'Active' },
  { id: 1004, name: 'Emma Chen', firstName: 'Emma', lastName: 'Chen', major: 'History', enrollmentDate: '2024-01-05', status: 'On Leave' },
  { id: 1005, name: 'Sophia Katz', firstName: 'Sophia', lastName: 'Katz', major: 'Biology', enrollmentDate: '2022-09-01', status: 'Graduated' }
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
