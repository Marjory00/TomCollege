import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, TitleCasePipe, DecimalPipe } from '@angular/common'; // Moved pipes here
import { Router, RouterModule } from '@angular/router'; // FIX 1: Import RouterModule
import { forkJoin, of, Subscription, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';

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
  activeEnrollments: number; // Sum of students across all classes (if linked)
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
        CommonModule,
        HttpClientModule,
        TitleCasePipe,
        DecimalPipe,
        RouterModule // FIX 1: Added RouterModule for [routerLink]
    ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  currentUser: User | null = null;
  userRole: string = 'guest'; // Added for convenience in HTML

  stats: DashboardStats = {
    totalStudents: 0,
    totalClasses: 0,
    totalSchedules: 0,
    activeEnrollments: 0
  };
  loading = true;
  errorMessage: string = '';

    // Define quick links based on user roles (copied from previous HTML structure)
    dashboardItems: { title: string, icon: string, link: string, roles: string[], statKey?: keyof DashboardStats }[] = [
        { title: 'Total Students', icon: 'fas fa-user-graduate', link: '/students', roles: ['admin', 'teacher'], statKey: 'totalStudents' },
        { title: 'Total Classes', icon: 'fas fa-book', link: '/classes', roles: ['admin', 'teacher'], statKey: 'totalClasses' },
        { title: 'Total Schedules', icon: 'fas fa-clipboard-list', link: '/schedules', roles: ['admin', 'teacher'], statKey: 'totalSchedules' },
        { title: 'Active Enrollments', icon: 'fas fa-users', link: '/classes', roles: ['admin'], statKey: 'activeEnrollments' },
        { title: 'Teacher Roster', icon: 'fas fa-chalkboard-teacher', link: '/teachers', roles: ['admin'] },
        // A placeholder for a student view
        { title: 'View My Schedule', icon: 'fas fa-calendar-alt', link: '/schedules', roles: ['student'] },
    ];


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
    // 1. Subscribe to user status
    this.userSubscription = this.authService.currentUser.subscribe(
      (user: User | null) => {
        this.currentUser = user;
        this.userRole = user?.role || 'guest';

        if (!this.currentUser) {
          this.router.navigate(['/login']);
          this.loading = false;
        } else {
          this.loadDashboardData();
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.userSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

  /**
   * Loads all required statistics concurrently using forkJoin.
   */
  loadDashboardData(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.errorMessage = '';

    if (this.currentUser.role === 'admin' || this.currentUser.role === 'teacher') {

      // Define observables with robust error handling
      const studentObs$: Observable<ListResponse<any>> = this.studentService.getAllStudents().pipe(
        catchError((error) => {
          console.error('Error loading students:', error);
          this.errorMessage = 'Some data failed to load.';
          return of({ data: [], count: 0 });
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
        // Finalize runs upon success or any error in the stream
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

          // Calculate active enrollments from class data (FIX 2: Safer access)
          this.stats.activeEnrollments = results.classes.data.reduce(
            (sum: number, cls: Class) => sum + ((cls as any).enrolledStudentIds?.length || 0), // Cast to 'any' for property not in strict Class model
            0
          );
        },
        error: (err) => {
          // Catch for critical stream errors
          console.error('Critical Error in forkJoin stream:', err);
          this.errorMessage = this.errorMessage || 'A critical error occurred while initializing the dashboard.';
        }
      });
    } else {
      // For student role, or any non-admin/teacher, stop loading immediately
      this.loading = false;
    }
  }

  /**
   * Checks if a link should be visible to the current user. (Added for template utility)
   * @param roles - Array of roles allowed to see the link.
   * @returns boolean - True if the user's role is included.
   */
  canViewItem(roles: string[]): boolean {
    return roles.includes(this.userRole);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
