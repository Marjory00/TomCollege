// src/app/services/teacher.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Teacher, NewTeacher } from '../models/teacher.model'; // Import necessary types

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = '/api/teachers';

  constructor(private http: HttpClient) { }

  getAllTeachers(query?: string): Observable<any> {
    console.warn(`TeacherService: Mock fetching teachers with query: ${query}`);
    return of({
      data: [{ id: 'TEA1', firstName: 'Jane', lastName: 'Doe', department: 'CS' }],
      total: 1
    });
  }

  getTeacherById(id: string): Observable<Teacher> {
    console.warn(`TeacherService: Mock fetching teacher ID: ${id}`);
    // Mock return of a single teacher
    const mockTeacher: Teacher = {
        id: id,
        firstName: 'Mock',
        lastName: 'Teacher',
        email: 'mock@test.com',
        phone: '555-1234',
        role: 'teacher',
        status: 'Active',
        department: 'Computer Science',
        subject: 'Algorithms',
        hireDate: '2015-08-01',
        officeLocation: 'Bldg C, Rm 212',
        adviseeIds: []
    };
    return of(mockTeacher);
  }

  /** FIX: Add the missing updateTeacher method */
  updateTeacher(id: string, teacher: Partial<Teacher>): Observable<Teacher> {
      console.warn(`TeacherService: Mock update of teacher ID: ${id}`);
      // Mock API call return
      return of({ ...teacher, id: id } as Teacher);
      // Real: return this.http.put<Teacher>(`${this.apiUrl}/${id}`, teacher);
  }

  /** Add createTeacher method for completeness */
  createTeacher(teacher: NewTeacher): Observable<Teacher> {
      console.warn('TeacherService: Mock creation of new teacher');
      const newId = 'TEA' + Math.floor(Math.random() * 1000);
      // Mock API call return
      return of({ ...teacher, id: newId, role: 'teacher', status: 'Active', adviseeIds: [], dateJoined: new Date().toISOString() } as Teacher);
      // Real: return this.http.post<Teacher>(this.apiUrl, teacher);
  }
}
