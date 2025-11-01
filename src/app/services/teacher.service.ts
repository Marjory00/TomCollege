import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// Assuming you have a Teacher model defined
import { Teacher } from '../models/teacher.model';
// Assuming you have an environment file setup
import { environment } from '@env/environment';

// Defining the expected response structure for list operations
interface ListResponse<T> {
    data: T[];
    count: number;
}

// Interface matching the needs of the schedule form (simplified reference)
interface TeacherReference {
    id: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class TeacherService {
    private apiUrl = `${environment.apiUrl}/teachers`;

    constructor(private http: HttpClient) { }

    /**
     * Fetches a list of all teachers, returning the full ListResponse object.
     * @returns An Observable of the ListResponse object containing Teacher[] and count.
     */
    getAllTeachers(): Observable<ListResponse<Teacher>> {
        return this.http.get<ListResponse<Teacher>>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Fetches a simplified list of teacher references (ID and Name) for selection dropdowns.
     * Assumes an API endpoint exists for this purpose.
     * @returns An Observable of TeacherReference[]
     */
    getAllTeacherReferences(): Observable<TeacherReference[]> {
        // Note: Assuming your API has a dedicated endpoint for reference lists
        return this.http.get<ListResponse<TeacherReference>>(`${this.apiUrl}/references`).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    /**
     * Fetches a single teacher by their ID.
     * @param id The ID of the teacher to fetch.
     * @returns An Observable of the Teacher object.
     */
    getTeacherById(id: string): Observable<Teacher> {
        return this.http.get<{ data: Teacher }>(`${this.apiUrl}/${id}`).pipe(
            // The API often wraps the single resource in a 'data' property
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    /**
     * Sends a request to create a new teacher.
     * @param teacherData The Teacher object to create (without an ID).
     * @returns An Observable of the newly created Teacher object.
     */
    createTeacher(teacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Observable<Teacher> {
        return this.http.post<{ data: Teacher }>(this.apiUrl, teacherData).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    /**
     * Sends a request to update an existing teacher.
     * @param teacherData The Teacher object with the ID included.
     * @returns An Observable of the updated Teacher object.
     */
    updateTeacher(teacherData: Teacher): Observable<Teacher> {
        const { id, ...body } = teacherData;
        return this.http.put<{ data: Teacher }>(`${this.apiUrl}/${id}`, body).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    /**
     * Deletes a teacher by their ID.
     * @param id The ID of the teacher to delete.
     * @returns An Observable for the completion status (void response).
     */
    deleteTeacher(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * CRITICAL FIX: Centralized error handling defined as an arrow function property
     * to retain the correct 'this' context when used in Observable pipe(catchError(this.handleError)).
     * @param error The HttpErrorResponse object.
     * @returns An Observable that throws the error.
     */
    private handleError = (error: HttpErrorResponse): Observable<never> => {
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

        console.error('HTTP Error in TeacherService:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
