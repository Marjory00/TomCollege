
// src/app/components/schedules/schedules.component.ts

import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule } from '../../models/schedule.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  schedules: Schedule[] = [];
  loading = true;
  currentUser: any;

  constructor(
    private scheduleService: ScheduleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.loading = true;
    this.scheduleService.getAllSchedules().subscribe({
      next: (response) => {
        this.schedules = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
        this.loading = false;
      }
    });
  }

  deleteSchedule(id: string): void {
    if (!this.authService.hasRole(['admin'])) {
        alert('You do not have permission to delete schedules.');
        return;
    }

    if (confirm('Are you sure you want to delete this schedule?')) {
      this.scheduleService.deleteSchedule(id).subscribe({
        next: () => {
          this.loadSchedules();
          alert('Schedule deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting schedule:', error);
          alert('Failed to delete schedule');
        }
      });
    }
  }
}
