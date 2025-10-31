import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

// Assuming these models and services exist
import { User } from '../../models/user.model';
import { Schedule } from '../../models/schedule.model';
import { ScheduleService } from '../../services/schedule.service';
import { AuthService } from '../../services/auth.service';

// Interface for API list response (must be imported or defined here)
interface ListResponse<T> {
  data: T[];
  count: number;
}

@Component({
  selector: 'app-schedules',
  standalone: true,
  // Add necessary modules for routing, directives, and services
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {

  schedules: Schedule[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  currentUserRole: string | undefined;

  constructor(
    private scheduleService: ScheduleService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the synchronous user object for immediate role check
    const user: User | null = this.authService.currentUserValue;
    this.currentUserRole = user?.role;

    // Only Admin and Teacher roles are typically allowed to manage schedules
    if (this.currentUserRole === 'admin' || this.currentUserRole === 'teacher') {
      this.loadSchedules();
    } else {
      // Handle unauthorized access
      this.errorMessage = 'You do not have permission to view or manage schedules.';
      this.loading = false;
    }
  }

  /**
   * Fetches the list of schedules from the service.
   */
  loadSchedules(): void {
    this.loading = true;
    this.errorMessage = null;

    // The service returns Observable<ListResponse<Schedule>>
    this.scheduleService.getAllSchedules()
      .pipe(
        // Ensure loading state is turned off on completion or error
        finalize(() => this.loading = false),
        // Catch errors and return an empty list response object
        catchError(error => {
          console.error('Error fetching schedules:', error);
          this.errorMessage = 'Failed to load schedule list. Please check the network.';
          // FIX APPLIED: Return a ListResponse object on error
          return of({ data: [], count: 0 } as ListResponse<Schedule>);
        })
      )
      .subscribe({
        // FIX APPLIED: Expect ListResponse<Schedule> and use .data
        next: (response: ListResponse<Schedule>) => {
          this.schedules = response.data;
        },
        error: (err) => {
          console.error('Subscription error:', err);
        }
      });
  }

  /**
   * Navigate to the form to add a new schedule.
   */
  addSchedule(): void {
    this.router.navigate(['/schedules/add']);
  }

  /**
   * Navigate to the detail/edit view for a specific schedule.
   * @param scheduleId The ID of the schedule (can be string or undefined).
   */
  editSchedule(scheduleId: string | undefined): void {
    // Type guard to ensure the ID is defined before navigating
    if (scheduleId) {
      this.router.navigate(['/schedules/edit', scheduleId]);
    } else {
      console.warn('Attempted to edit a schedule with no ID.');
    }
  }
}
