// src/app/services/teacher.service.ts

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Teacher, NewTeacherData } from '../models/teacher.model';
// Assuming TeacherListResponse is used similarly to StudentListResponse
import { ApiResponse } from '../models/user.model';

// Assuming this interface structure exists for consistency with DashboardComponent
interface TeacherListResponse {
  teachers: Teacher[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = `${environment.apiUrl}/teachers`;

  constructor(
    @Inject(HttpClient) private http: HttpClient
  ) {}

  /**
   * Fetches a list of teachers with optional pagination/filtering.
   * Assumed to return TeacherListResponse for Dashboard consistency.
   * @returns Observable of Teacher list response.
   */
  getTeachers(params?: any): Observable<TeacherListResponse> {
    return this.http.get<TeacherListResponse>(this.apiUrl, { params });
  }

  /**
   * Fetches a single teacher by their ID.
   * @param id The unique ID of the teacher.
   * @returns Observable of the Teacher object.
   */
  getTeacherById(id: string): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new teacher record.
   * @param teacherData The data required to create a new teacher.
   * @returns Observable of the newly created Teacher object.
   */
  addTeacher(teacherData: NewTeacherData): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, teacherData);
  }

  /**
   * Updates an existing teacher record.
   * @param id The ID of the teacher to update.
   * @param updateData The partial data to update on the teacher record.
   * @returns Observable of the updated Teacher object.
   */
  updateTeacher(id: string, updateData: Partial<Teacher>): Observable<Teacher> {
    return this.http.patch<Teacher>(`${this.apiUrl}/${id}`, updateData);
  }

  /**
   * Deletes a teacher record.
   * @param id The ID of the teacher to delete.
   * @returns Observable signaling successful deletion.
   */
  deleteTeacher(id: string): Observable<Object> {
    // FIX: Changed delete<ApiResponse> to delete<Object>
    // This resolves TS2314 by providing a concrete type argument.
    // If the API truly returns ApiResponse, use delete<ApiResponse<null>> or similar empty type.
    return this.http.delete<Object>(`${this.apiUrl}/${id}`);
  }
}
