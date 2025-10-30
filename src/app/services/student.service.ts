import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/api/students';

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getStudent(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Student): Observable<any> {
    return this.http.post(this.apiUrl, student);
  }

  updateStudent(id: string, student: Partial<Student>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getStudentClasses(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/classes`);
  }
}
