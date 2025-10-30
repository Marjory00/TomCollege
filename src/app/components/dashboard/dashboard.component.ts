import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of, Subscription, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';
import { TitleCasePipe, DecimalPipe } from '@angular/common'; // Import necessary pipes for the template

// Assuming these models and services exist
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
  standalone: true,
  // Add pipes used in the template (TitleCasePipe, DecimalPipe for 'number' alias)
  imports: [CommonModule, HttpClientModule, TitleCasePipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  currentUser: User | null = null;
  stats: DashboardStats = {
    totalStudents: 0,
    totalClasses: 0,
    totalSchedules: 0,
    activeEnrollments: 0
  };
  loading = true;
  errorMessage: string = '';

  private userSubscription: Subscription = new Subscription();
  private dataSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private classService: ClassService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Subscribe to user status to handle login/logout and initial loading
    this.userSubscription = this.authService.currentUser.subscribe(
      (user: User | null) => {
        this.currentUser = user;

        if (!this.currentUser) {
          this.router.navigate(['/login']);
          this.loading = false;
        } else {
          // Load data only after the user has been confirmed
          this.loadDashboardData();
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions to prevent memory leaks
    this.userSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

  /**
   * Loads all required statistics concurrently using forkJoin.
   * Uses catchError to handle individual failures and finalize to reset loading state.
   */
  loadDashboardData(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.errorMessage = '';

    if (this.currentUser.role === 'admin' || this.currentUser.role === 'teacher') {

      // Define observables with robust error handling (CRITICAL FIX)
      const studentObs$: Observable<ListResponse<any>> = this.studentService.getAllStudents().pipe(
        catchError((error) => {
          console.error('Error loading students:', error);
          this.errorMessage = 'Some data failed to load.';
          return of({ data: [], count: 0 }); // Returns a completed observable with empty data
        })
      );

      const classObs$: Observable<ListResponse<Class>> = this.classService.getAllClasses().pipe(
        catchError((error) => {
          console.error('Error loading classes:', error);
          this.errorMessage = 'Some data failed to load.';
          return of({ data: [], count: 0 });
        })
      );

      const scheduleObs$: Observable<ListResponse<any>> = this.scheduleService.getAllSchedules().pipe(
        catchError((error) => {
          console.error('Error loading schedules:', error);
          this.errorMessage = 'Some data failed to load.';
          return of({ data: [], count: 0 });
        })
      );

      // Subscribe to the concurrent data stream
      this.dataSubscription = forkJoin({
        students: studentObs$,
        classes: classObs$,
        schedules: scheduleObs$
      }).pipe(
        // Finalize always runs, GUARANTEEING loading=false (CRITICAL FIX)
        finalize(() => {
             this.loading = false;
        })
      )
      .subscribe({
        next: (results) => {
          // Process statistics counts
          this.stats.totalStudents = results.students.count;
          this.stats.totalClasses = results.classes.count;
          this.stats.totalSchedules = results.schedules.count;

          // Calculate active enrollments from class data
          this.stats.activeEnrollments = results.classes.data.reduce(
            (sum: number, cls: Class) => sum + (cls.enrolledStudentIds?.length || 0),
            0
          );
        },
        error: (err) => {
          // This should only catch critical, non-HTTP errors
          console.error('Critical Error in forkJoin stream:', err);
          this.errorMessage = this.errorMessage || 'A critical error occurred while initializing the dashboard.';
        }
      });
    } else {
      // For student role, or any non-admin/teacher, stop loading immediately
      this.loading = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
