import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Student } from '../models/student.model';
import { environment } from '@env/environment'; // CRITICAL FIX 1: Import environment

// Interface for API list response
interface ListResponse<T> {
  data: T[];
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // CRITICAL FIX 2: Use environment variable for the API URL
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated and filtered list of students.
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

    // Make the actual HTTP GET request with parameters, applying error handling
    return this.http.get<ListResponse<Student>>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Fetches a single student by ID.
   */
  getStudent(id: string): Observable<Student> {
    // CRITICAL FIX 3: Assume API wraps single object in 'data' and use map to unwrap.
    return this.http.get<{ data: Student }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new student record.
   * Signature updated to use Omit<Student, ...> for clear typing.
   */
  createStudent(student: Omit<Student, 'id'>): Observable<Student> {
    // CRITICAL FIX 4: Assume API returns the created object wrapped in 'data' and use map.
    return this.http.post<{ data: Student }>(this.apiUrl, student).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing student record.
   */
  updateStudent(student: Student): Observable<Student> {
    // CRITICAL FIX 5: Accept the full model, destructure the ID for the URL, and unwrap with map.
    const { id, ...body } = student;
    return this.http.put<{ data: Student }>(`${this.apiUrl}/${id}`, body).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a student record.
   */
  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Fetches the classes for a specific student.
   */
  getStudentClasses(id: string): Observable<any> {
    // Apply error handling to the existing endpoint
    return this.http.get(`${this.apiUrl}/${id}/classes`).pipe(
      catchError(this.handleError)
    );
  }

  // CRITICAL FIX 6: Centralized error handling using an arrow function to bind 'this'.
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      const backendError = error.error as { message?: string };
      if (backendError && backendError.message) {
        errorMessage = `Server Error (${error.status}): ${backendError.message}`;
      } else {
        errorMessage = `Server Error: ${error.status} ${error.statusText || 'Unknown Status'}`;
      }
    }

    console.error('HTTP Error in StudentService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
