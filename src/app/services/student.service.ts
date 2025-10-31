import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Import HttpParams for query building
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';

// Interface for API list response (must match what the component expects)
interface ListResponse<T> {
  data: T[];
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/api/students';

  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated and filtered list of students.
   * FIX APPLIED: Signature updated to accept 5 arguments and return ListResponse<Student>.
   */
  getAllStudents(
    page: number = 1,
    pageSize: number = 10,
    searchTerm: string = '',
    sortBy: string = 'lastName',
    sortDirection: 'asc' | 'desc' = 'asc'
  ): Observable<ListResponse<Student>> {

    // Construct query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', searchTerm)
      .set('sort', sortBy)
      .set('direction', sortDirection);

    // Make the actual HTTP GET request with parameters
    return this.http.get<ListResponse<Student>>(this.apiUrl, { params });
  }

  /**
   * Fetches a single student by ID.
   */
  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new student record.
   */
  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  /**
   * Updates an existing student record.
   */
  updateStudent(id: string, student: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  /**
   * Deletes a student record.
   */
  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Fetches the classes for a specific student.
   */
  getStudentClasses(id: string): Observable<any> {
    // Note: The return type here remains 'any' as the structure of the classes is not defined yet.
    return this.http.get(`${this.apiUrl}/${id}/classes`);
  }
}
