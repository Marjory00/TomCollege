
// src/app/services/schedule.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from '../models/schedule.model';

const API_URL = 'http://localhost:3000/api/schedules';

@Injectable({ providedIn: 'root' })
export class ScheduleService {

  constructor(private http: HttpClient) { }

  getAllSchedules(): Observable<{ count: number, data: Schedule[] }> {
    return this.http.get<{ count: number, data: Schedule[] }>(API_URL);
  }

  deleteSchedule(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL}/${id}`);
  }
}
