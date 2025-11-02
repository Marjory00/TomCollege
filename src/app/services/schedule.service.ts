// src/app/services/schedule.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { Schedule } from '../models/schedule.model';

// Interface for API list response
interface ApiResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = '/api/schedules';

  constructor(private http: HttpClient) { }

  getAllSchedules(): Observable<ApiResponse<Schedule>> {
    console.warn('ScheduleService.getAllSchedules is using a MOCK API response.');

    const mockData: Schedule[] = [
      {
        id: 'S001',
        studentId: 'STU123',
        teacherId: 'TEA456',
        courseId: 'CS201',
        className: 'Data Structures 📊',
        location: 'Bldg A, Room 305',
        days: ['Mon', 'Wed'],
        startTime: '09:00 AM',
        endTime: '10:30 AM',
        term: 'Fall',
        year: 2025,
        notes: 'Requires weekly lab attendance.',
        dayOfWeek: 'Monday',
        timeSlot: '09:00 AM - 10:30 AM'
      },
      {
        id: 'S002',
        studentId: 'STU789',
        teacherId: 'TEA111',
        courseId: 'MTH101',
        className: 'Calculus I ➗',
        location: 'Online / Zoom',
        days: ['Tue', 'Thu'],
        startTime: '01:00 PM',
        endTime: '02:30 PM',
        term: 'Spring',
        year: 2026,
        notes: '',
        dayOfWeek: 'Tuesday',
        timeSlot: '01:00 PM - 02:30 PM'
      }
    ];

    return of({ data: mockData, total: mockData.length, page: 1, limit: 10 } as ApiResponse<Schedule>);
  }

  getScheduleById(id: string): Observable<Schedule> {
    console.warn(`ScheduleService: Mock fetching schedule ID: ${id}`);

    return this.getAllSchedules().pipe(
      map(response => {
        const schedule = response.data.find(s => s.id === id);
        return schedule as Schedule;
      })
    );
  }

  deleteSchedule(id: string): Observable<any> {
    console.warn(`ScheduleService: Mock deletion of schedule ID: ${id}`);
    return of({ success: true, message: `Schedule ${id} deleted.` });
  }

  createSchedule(schedule: Schedule): Observable<Schedule> {
    console.warn('ScheduleService: Mock creation of a new schedule.');
    const newId = 'S' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return of({ ...schedule, id: newId });
  }

  updateSchedule(schedule: Schedule): Observable<Schedule> {
    console.warn(`ScheduleService: Mock update of schedule ID: ${schedule.id}`);
    return of(schedule);
  }
}
