// src/app/services/student.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Define the expected response type for deletion
interface DeleteResponse {
    success: boolean;
    message: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = '/api/students';

  constructor(private http: HttpClient) { }

  getAllStudents(): Observable<any> {
    return of({ data: [], total: 0 });
  }

  getStudentById(id: string): Observable<any> {
    return of(null);
  }

  // FIX: Add the deleteStudent method, explicitly typing the return value
  deleteStudent(id: string): Observable<DeleteResponse> {
    console.warn(`StudentService: Mock deletion of student ID: ${id}`);
    return of({ success: true, message: `Student ${id} deleted successfully.` });
  }
}
