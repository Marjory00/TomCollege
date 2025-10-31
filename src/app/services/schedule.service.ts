// src/app/services/schedule.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from '../models/schedule.model'; // Assuming Schedule model is complete

const API_URL = 'http://localhost:3000/api/schedules';

// Interface matching the expected API list response
interface ListResponse<T> {
  count: number;
  data: T[];
}

@Injectable({ providedIn: 'root' })
export class ScheduleService {

  constructor(private http: HttpClient) { }

  /**
   * Fetches all academic schedules, returning paginated data.
   */
  getAllSchedules(): Observable<ListResponse<Schedule>> {
    // Note: This implementation assumes the API handles pagination/filtering on the backend.
    return this.http.get<ListResponse<Schedule>>(API_URL);
  }

  /**
   * FIX: Retrieves a single schedule by ID.
   */
  getSchedule(id: string): Observable<Schedule> {
    return this.http.get<Schedule>(`${API_URL}/${id}`);
  }

  /**
   * FIX: Creates a new schedule record.
   */
  createSchedule(schedule: Schedule): Observable<Schedule> {
    // Omit the 'id' field for creation since the server generates it
    const { id, ...data } = schedule;
    return this.http.post<Schedule>(API_URL, data);
  }

  /**
   * FIX: Updates an existing schedule record.
   */
  updateSchedule(id: string, schedule: Partial<Schedule>): Observable<Schedule> {
    return this.http.put<Schedule>(`${API_URL}/${id}`, schedule);
  }

  /**
   * Deletes a schedule record by ID.
   */
  deleteSchedule(id: string): Observable<void> {
    // Using `void` as the expected successful response body type is usually empty
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
