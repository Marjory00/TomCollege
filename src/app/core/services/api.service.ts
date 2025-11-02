import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 💡 NOTE: Assuming these paths are correct relative to the ApiService location
import { Student } from '../models/student.model';
import { Course } from '../models/course.model';

// --- INTERFACES ---

/** Interface for the main dashboard data structure (metrics, recent table data) */
interface DashboardData {
    totalStudents: number;
    activeCourses: number;
    recentEnrollments: number;
    currentGPAAverage: number;
    cardData: { title: string; value: string; icon: string }[];
    tableData: { id: number; name: string; course: string; grade: string }[];
}

export interface UserProfile { // 🆕 FIX: Added export to make it reusable
    id: number;
    name: string;
    email: string;
    role: 'Student' | 'Faculty';
    department: string;
}

export interface GradeReport { // 🆕 FIX: Added export to make it reusable
    courseCode: string;
    courseTitle: string;
    instructor: string;
    grade: string;
    status: 'Complete' | 'In Progress';
}
// --- END INTERFACES ---

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

    // --- NEW FEATURE METHODS (Adjusted path for consistency) ---

    /**
     * Fetches the current user's profile data. (e.g., /api/user/profile)
     */
    getProfile(): Observable<UserProfile> {
        // 🆕 FIX: Changed path to represent a current user resource
        return this.http.get<UserProfile>(`${API_BASE_URL}/user/profile`);
    }

    /**
     * Fetches the user's detailed grade report. (e.g., /api/user/grades)
     */
    getGrades(): Observable<GradeReport[]> {
        // 🆕 FIX: Changed path to represent a current user resource
        return this.http.get<GradeReport[]>(`${API_BASE_URL}/user/grades`);
    }

    /**
     * Fetches the user's current cumulative GPA as a number.
     * Path remains short since it's a simple metric endpoint.
     */
    getCurrentGPA(): Observable<number> {
        return this.http.get<number>(`${API_BASE_URL}/grades/gpa`);
    }
}
