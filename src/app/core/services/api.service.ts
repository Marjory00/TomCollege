import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';

// --- NEW INTERFACES (Matching the data.json structure) ---

/** Interface for the main dashboard data structure (metrics, recent table data) */
interface DashboardData {
    totalStudents: number;
    activeCourses: number;
    recentEnrollments: number;
    currentGPAAverage: number;
    cardData: { title: string; value: string; icon: string }[];
    tableData: { id: number; name: string; course: string; grade: string }[];
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'Faculty';
  department: string;
}

interface GradeReport {
  courseCode: string;
  courseTitle: string;
  instructor: string;
  grade: string;
  status: 'Complete' | 'In Progress';
}
// --- END NEW INTERFACES ---

// Define the base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api';

// Injectable service (Singleton)
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  // --- CORE DATA METHODS (Existing) ---

  /**
    * Fetches the main dashboard data from the backend.
    * FIX: Uses the strongly-typed DashboardData interface.
    */
  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${API_BASE_URL}/dashboard`);
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

  // --- NEW FEATURE METHODS ---

  /**
    * Fetches the current user's profile data.
    */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_BASE_URL}/profile`);
  }

  /**
    * Fetches the user's detailed grade report.
    */
  getGrades(): Observable<GradeReport[]> {
    return this.http.get<GradeReport[]>(`${API_BASE_URL}/grades/report`);
  }

  /**
    * Fetches the user's current cumulative GPA as a number.
    */
  getCurrentGPA(): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/grades/gpa`);
  }

  // Add more methods for other CRUD operations (POST, PUT, DELETE) as needed.
}
