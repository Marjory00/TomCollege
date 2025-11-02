// src/app/components/schedules/schedules.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';

import { User } from '../../models/user.model';
import { Schedule } from '../../models/schedule.model';
import { ScheduleService } from '../../services/schedule.service';
import { AuthService } from '../../services/auth.service';

// Interface for API response
interface ApiResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {

  schedules: Schedule[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  currentUserRole: string | undefined;

  constructor(
    @Inject(ScheduleService) private scheduleService: ScheduleService,
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user: User | null = this.authService.currentUserValue;
    this.currentUserRole = user?.role;

    // Admin and Teacher roles are typically allowed to manage schedules
    if (this.currentUserRole === 'admin' || this.currentUserRole === 'teacher') {
      this.loadSchedules();
    } else {
      this.errorMessage = 'You do not have permission to view or manage schedules.';
      this.loading = false;
    }
  }

  loadSchedules(): void {
    this.loading = true;
    this.errorMessage = null;

    this.scheduleService.getAllSchedules()
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error fetching schedules:', error);
          this.errorMessage = 'Failed to load schedule list. Please check the network.';
          return of({ data: [], total: 0 } as ApiResponse<Schedule>);
        })
      )
      .subscribe({
        next: (response: ApiResponse<Schedule>) => {
          this.schedules = response.data;
        },
        error: (err) => {
          console.error('Subscription error:', err);
        }
      });
  }

  addSchedule(): void {
    this.router.navigate(['/schedules/add']);
  }

  editSchedule(scheduleId: string | undefined): void {
    if (scheduleId) {
      this.router.navigate(['/schedules/edit', scheduleId]);
    } else {
      console.warn('Attempted to edit a schedule with no ID.');
    }
  }

  deleteSchedule(id: string): void {
      if (confirm(`Are you sure you want to permanently delete schedule ID: ${id}?`)) {

          this.scheduleService.deleteSchedule(id)
              .pipe(
                  catchError(error => {
                      console.error(`Error deleting schedule ${id}:`, error);
                      this.errorMessage = `Failed to delete schedule ${id}.`;
                      return of(null);
                  })
              )
              .subscribe(response => {
                  if (response) {
                      console.log(`Schedule ${id} deleted successfully.`);
                      this.loadSchedules();
                  }
              });
      }
  }
}
