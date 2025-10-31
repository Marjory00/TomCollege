import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse for typing
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Class } from '../models/class.model';
import { environment } from '@env/environment'; // Assuming environment is correctly defined and imported

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
      catchError(this.handleError)
    );
  }

  /**
   * Fetches a list of all classes, returning only the Class[] for reference lists.
    * This is useful for dropdowns where pagination/count isn't needed.
    */
  getAllClassReferences(): Observable<Class[]> {
    return this.http.get<ListResponse<Class>>(this.apiUrl + '/references').pipe(
      map(response => response.data),
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
      // Use map to unwrap the 'data' property
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Sends a request to create a new class.
   * @param classData The Class object to create (without an ID).
   * @returns An Observable of the newly created Class object.
   */
  createClass(classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Observable<Class> {
    return this.http.post<{ data: Class }>(this.apiUrl, classData).pipe(
      // Use map to unwrap the 'data' property
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
      // Use map to unwrap the 'data' property
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a class by its ID.
   * @param id The ID of the class to delete.
   * @returns An Observable for the completion status (void response).
   */
  deleteClass(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * FIX APPLIED: Centralized error handling for HTTP requests.
   * @param error The HttpErrorResponse object.
   * @returns An Observable that throws the error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      const backendError = error.error as { message?: string };
      if (backendError && backendError.message) {
        errorMessage = `Server Error (${error.status}): ${backendError.message}`;
      } else {
        errorMessage = `Server Error: ${error.status} ${error.statusText || 'Unknown Status'}`;
      }
    }

    console.error('HTTP Error in ClassService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
