// src/app/services/student.service.ts

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Student, NewStudentData } from '../models/student.model';
// FIX: UserRole is now correctly imported from the fixed user.model.ts
import { UserRole } from '../models/user.model';

// Defines the expected structure for API response when fetching a list
interface StudentListResponse {
  students: Student[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(
    @Inject(HttpClient) private http: HttpClient
  ) {}

  /**
   * Fetches a list of students with optional pagination/filtering.
   * @returns Observable of Student list response.
   */
  getStudents(params?: any): Observable<StudentListResponse> {
    // Note: Angular's HttpClient automatically handles URLSearchParams from the 'params' object
    return this.http.get<StudentListResponse>(this.apiUrl, { params });
  }

  /**
   * Fetches a single student by their ID.
   * @param id The unique ID of the student.
   * @returns Observable of the Student object.
   */
  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new student record.
   * @param studentData The data required to create a new student.
   * @returns Observable of the newly created Student object.
   */
  addStudent(studentData: NewStudentData): Observable<Student> {
    // Ensure the role is explicitly set for the backend validation
    // The NewStudentData interface should enforce role: 'student', but casting here ensures safety
    const payload = { ...studentData, role: 'student' as UserRole };
    return this.http.post<Student>(this.apiUrl, payload);
  }

  /**
   * Updates an existing student record.
   * @param id The ID of the student to update.
   * @param updateData The partial data to update on the student record.
   * @returns Observable of the updated Student object.
   */
  updateStudent(id: string, updateData: Partial<Student>): Observable<Student> {
    return this.http.patch<Student>(`${this.apiUrl}/${id}`, updateData);
  }

  /**
   * Deletes a student record.
   * @param id The ID of the student to delete.
   * @returns Observable signaling successful deletion (typically void or an object with a message).
   */
  deleteStudent(id: string): Observable<void> {
    // Assuming the API returns an empty body or a simple success object on deletion
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
