// src/app/services/schedule.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Schedule } from '../models/schedule.model';
import { environment } from '@env/environment'; // CRITICAL FIX 1: Import environment

// Defining the expected response structure for list operations
interface ListResponse<T> {
    count: number;
    data: T[];
}

@Injectable({ providedIn: 'root' })
export class ScheduleService {
    // CRITICAL FIX 2: Use environment variable for the API URL
    private apiUrl = `${environment.apiUrl}/schedules`;

    constructor(private http: HttpClient) { }

    /**
     * Fetches all academic schedules, returning paginated data.
     */
    getAllSchedules(): Observable<ListResponse<Schedule>> {
        return this.http.get<ListResponse<Schedule>>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Retrieves a single schedule by ID.
     */
    getSchedule(id: string): Observable<Schedule> {
        // FIX 3: Assume API wraps single objects in a 'data' property and use map to unwrap.
        return this.http.get<{ data: Schedule }>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    /**
     * Creates a new schedule record.
     */
    createSchedule(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Observable<Schedule> {
        // FIX 4: Use Omit<Schedule, ...> for clear typing of the input.
        // FIX 5: Assume API returns the created object wrapped in 'data' and use map.
        return this.http.post<{ data: Schedule }>(this.apiUrl, schedule).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    /**
     * Updates an existing schedule record.
     */
    updateSchedule(schedule: Schedule): Observable<Schedule> {
        // FIX 6: Accept the full model and destructure the ID for the URL.
        // FIX 7: Assume API returns the updated object wrapped in 'data' and use map.
        const { id, ...body } = schedule;
        return this.http.put<{ data: Schedule }>(`${this.apiUrl}/${id}`, body).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    /**
     * Deletes a schedule record by ID.
     */
    deleteSchedule(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * CRITICAL FIX 8: Centralized error handling using an arrow function to bind 'this'.
     */
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

        console.error('HTTP Error in ScheduleService:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
