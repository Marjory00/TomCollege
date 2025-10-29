
// src/app/services/student.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';

const API_URL = 'http://localhost:3000/api/students';

@Injectable({ providedIn: 'root' })
export class StudentService {

  constructor(private http: HttpClient) { }

  getAllStudents(): Observable<{ count: number, data: Student[] }> {
    return this.http.get<{ count: number, data: Student[] }>(API_URL);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL}/${id}`);
  }
}
