// src/app/services/student.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Student, NewStudentData } from '../models/student.model';
import { ApiResponse } from '../models/api-response.model';

interface StudentListQuery {
    page?: number;
    limit?: number;
    search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getStudents(query?: StudentListQuery): Observable<ApiResponse<Student>> {
    let params = new HttpParams();

    if (query) {
      if (query.page) {
        params = params.set('page', query.page.toString());
      }
      if (query.limit) {
        params = params.set('limit', query.limit.toString());
      }
      if (query.search) {
        params = params.set('search', query.search);
      }
    }

    return this.http.get<ApiResponse<Student>>(this.apiUrl, { params });
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  addStudent(data: NewStudentData): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, data);
  }

  updateStudent(id: string, data: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, data);
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
