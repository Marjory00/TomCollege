// src/app/services/teacher.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Teacher, NewTeacherData } from '../models/teacher.model';
import { ApiResponse } from '../models/api-response.model';

interface TeacherListQuery {
    page?: number;
    limit?: number;
    search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = `${environment.apiUrl}/teachers`;

  constructor(private http: HttpClient) {}

  getTeachers(query?: TeacherListQuery): Observable<ApiResponse<Teacher>> {
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
    return this.http.get<ApiResponse<Teacher>>(this.apiUrl, { params });
  }

  getTeacherById(id: string): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`);
  }

  addTeacher(data: NewTeacherData): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, data);
  }

  updateTeacher(id: string, data: Partial<Teacher>): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}`, data);
  }

  deleteTeacher(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
