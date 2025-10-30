import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf
import { Router } from '@angular/router'; // Implicitly needed for logout/navigation
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Assuming these models and services exist in the project structure
import { User } from '../../models/user.model';
import { Class } from '../../models/class.model';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
import { ClassService } from '../../services/class.service';
import { ScheduleService } from '../../services/schedule.service';

// Define the expected API response structure for clarity
interface ListResponse<T> {
  data: T[];
  count: number;
}

interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalSchedules: number;
  activeEnrollments: number;
}

@Component({
  selector: 'app-dashboard',
  // FIX 1: Convert to Standalone Component
  standalone: true,
  imports: [CommonModule], // Add CommonModule for directives like *ngIf
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats: DashboardStats = {
    totalStudents: 0,
    totalClasses: 0,
    totalSchedules: 0,
    activeEnrollments: 0
  };
  loading = true;
  errorMessage: string = ''; // New property for displaying load errors

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private classService: ClassService,
    private scheduleService: ScheduleService,
    private router: Router // Inject Router for logout redirection
  ) {}

  ngOnInit(): void {
    // Check for user login status immediately
    this.currentUser = this.authService.currentUserValue;

    if (!this.currentUser) {
      // Redirect unauthenticated users if necessary
      this.router.navigate(['/login']);
      this.loading = false;
      return;
    }

    this.loadDashboardData();
  }

  /**
   * Loads all required statistics concurrently using forkJoin.
   */
  loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = '';

    // Only load stats if the user is an admin or teacher
    if (this.currentUser?.role === 'admin' || this.currentUser?.role === 'teacher') {

      const studentObs$ = this.studentService.getAllStudents().pipe(
        catchError((error) => {
          console.error('Error loading students:', error);
          // Return an observable of a partial response to prevent forkJoin from failing
          return of({ data: [], count: 0 } as ListResponse<any>);
        })
      );

      const classObs$ = this.classService.getAllClasses().pipe(
        catchError((error) => {
          console.error('Error loading classes:', error);
          return of({ data: [], count: 0 } as ListResponse<Class>);
        })
      );

      const scheduleObs$ = this.scheduleService.getAllSchedules().pipe(
        catchError((error) => {
          console.error('Error loading schedules:', error);
          return of({ data: [], count: 0 } as ListResponse<any>);
        })
      );

      // FIX 2: Use forkJoin to manage concurrent data fetching and unified error handling
      forkJoin({
        students: studentObs$,
        classes: classObs$,
        schedules: scheduleObs$
      }).subscribe({
        next: (results) => {
          // Process Student Data
          this.stats.totalStudents = results.students.count || 0;

          // Process Class Data
          this.stats.totalClasses = results.classes.count || 0;
          this.stats.activeEnrollments = results.classes.data.reduce(
            (sum: number, cls: Class) => sum + (cls.enrolledStudentIds?.length || 0),
            0
          );

          // Process Schedule Data
          this.stats.totalSchedules = results.schedules.count || 0;

          this.loading = false;
        },
        error: (err) => {
          // This should ideally only catch errors from catchError() if implemented differently,
          // but serves as a final fallback.
          this.errorMessage = 'An error occurred while loading dashboard statistics.';
          this.loading = false;
        }
      });
    } else {
      // For student role, data will be loaded via separate specialized components (not shown here)
      this.loading = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to login after logout
  }
}
