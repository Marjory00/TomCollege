import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // <-- Import map operator
import { Class } from '../models/class.model';
import { environment } from '@env/environment';

// Defining the expected response structure for list operations
interface ListResponse<T> {
  data: T[];
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = `${environment.apiUrl}/classes`;

  constructor(private http: HttpClient) { }

  /**
   * Fetches a list of all classes, returning the full ListResponse object.
   * @returns An Observable of the ListResponse object containing Class[] and count.
   */
  getAllClasses(): Observable<ListResponse<Class>> {
    return this.http.get<ListResponse<Class>>(this.apiUrl).pipe(
      // We return the full object here to keep the count property
      catchError(this.handleError)
    );
  }

  /**
   * Fetches a single class by its ID.
   * @param id The ID of the class to fetch.
   * @returns An Observable of the Class object.
   */
  getClassById(id: string): Observable<Class> {
    return this.http.get<{ data: Class }>(`${this.apiUrl}/${id}`).pipe(
      // FIX: Use map to unwrap the 'data' property
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Sends a request to create a new class.
   * @param classData The Class object to create (without an ID).
   * @returns An Observable of the newly created Class object.
   */
  createClass(classData: Omit<Class, 'id'>): Observable<Class> {
    return this.http.post<{ data: Class }>(this.apiUrl, classData).pipe(
      // FIX: Use map to unwrap the 'data' property
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Sends a request to update an existing class.
   * @param classData The Class object with the ID included.
   * @returns An Observable of the updated Class object.
   */
  updateClass(classData: Class): Observable<Class> {
    const { id, ...body } = classData;
    return this.http.put<{ data: Class }>(`${this.apiUrl}/${id}`, body).pipe(
      // FIX: Use map to unwrap the 'data' property
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a class by its ID.
   * @param id The ID of the class to delete.
   * @returns An Observable for the completion status (void response).
   */
  deleteClass(id: string): Observable<void> { // <-- Explicitly set return type to void
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Centralized error handling for HTTP requests.
   * @param error The HttpErrorResponse object.
   * @returns An Observable that throws the error.
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      // Backend returned an error response body with a message field
      errorMessage = `Server Error: ${error.status} - ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code.
      errorMessage = `Server Error: ${error.status} ${error.statusText}`;
    }
    console.error(error);
    return throwError(() => new Error(errorMessage));
  }
}
