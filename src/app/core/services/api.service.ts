
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';

// Define the base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api';

// Injectable service (Singleton)
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  /**
   * Fetches the main dashboard data from the backend.
   * The return type is typically an object that matches the 'dashboard' section of data.json.
   */
  getDashboardData(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/dashboard`);
  }

  /**
   * Fetches the list of all students.
   */
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${API_BASE_URL}/students`);
  }

  /**
   * Fetches the list of all courses.
   */
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${API_BASE_URL}/courses`);
  }

  // Add more methods for other CRUD operations (POST, PUT, DELETE) as needed.
}
