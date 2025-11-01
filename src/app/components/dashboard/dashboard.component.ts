// src/app/components/dashboard/dashboard.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe, DecimalPipe } from '@angular/common'; // Import Pipes for use in template
import { Router, RouterModule } from '@angular/router';
import { Observable, finalize, catchError, of, forkJoin } from 'rxjs';

// Assuming these imports exist
import { AuthService } from '../../services/auth.service';
import { TeacherService } from '../../services/teacher.service';
import { StudentService } from '../../services/student.service';
import { User } from '../../models/user.model';
import { Teacher } from '../../models/teacher.model';
import { Student } from '../../models/student.model';

// Define the expected response and internal data structures
interface StudentListResponse { students: Student[]; total: number; }
interface TeacherListResponse { teachers: Teacher[]; total: number; }

interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  activeEnrollments: number;
  totalSchedules: number;
}

interface DashboardItem {
  title: string;
  icon: string;
  link: string;
  roles: User['role'][];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Ensure we import TitleCasePipe and DecimalPipe for use in the HTML
  imports: [CommonModule, RouterModule, TitleCasePipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: User | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;

  // FIX 1: Initialize the 'stats' property needed by the template
  stats: DashboardStats = {
    totalClasses: 0,
    totalStudents: 0,
    activeEnrollments: 0,
    totalSchedules: 0,
  };

  // FIX 2: Initialize the 'dashboardItems' property needed by the template
  dashboardItems: DashboardItem[] = [
    { title: 'Manage Students', icon: 'fas fa-user-graduate', link: '/students', roles: ['admin', 'teacher'] },
    { title: 'Manage Teachers', icon: 'fas fa-chalkboard-teacher', link: '/teachers', roles: ['admin'] },
    { title: 'Manage Classes', icon: 'fas fa-book', link: '/classes', roles: ['admin', 'teacher'] },
    { title: 'System Settings', icon: 'fas fa-cog', link: '/settings', roles: ['admin'] },
    { title: 'View My Schedule', icon: 'fas fa-calendar-alt', link: '/schedule', roles: ['student', 'teacher'] },
  ];

  // Cleaned up placeholder properties/methods are now correctly implemented or removed.

  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(TeacherService) private teacherService: TeacherService,
    @Inject(StudentService) private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboardData();
  }

  // --- Implemented Methods ---

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Implements role-based visibility check for dashboard items.
   * Note: The template is passing an array (item.roles), so this function is updated to check arrays.
   */
  canViewItem(requiredRoles: User['role'][]): boolean {
    if (!this.currentUser) return false;
    // Checks if the user's role is included in the list of required roles
    return requiredRoles.includes(this.currentUser.role);
  }

  // --- Core Data Loading Logic ---

  loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = null;

    if (this.currentUser?.role === 'admin') {
      this.loadAdminSummary();
    } else if (this.currentUser?.role === 'teacher') {
      this.loadTeacherView();
    } else if (this.currentUser?.role === 'student') {
      this.loadStudentView();
    } else {
      this.loading = false;
      this.errorMessage = 'Unknown user role.';
    }
  }

  loadAdminSummary(): void {

    const teachers$ = this.teacherService.getTeachers().pipe(
      catchError(error => { console.error('Error loading teachers:', error); return of({ teachers: [], total: 0 } as TeacherListResponse); })
    );

    const students$ = this.studentService.getStudents().pipe(
      catchError(error => { console.error('Error loading students:', error); return of({ students: [], total: 0 } as StudentListResponse); })
    );

    type DashboardResponses = [TeacherListResponse, StudentListResponse];

    forkJoin([teachers$, students$])
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          this.errorMessage = 'Failed to load dashboard summary data.';
          return of(null);
        })
      )
      .subscribe((responses: DashboardResponses | null) => {
        if (!responses) return;

        const [teacherResponse, studentResponse] = responses;

        // FIX 3: Update the 'stats' object with loaded data
        this.stats = {
          totalStudents: studentResponse.total,
          totalClasses: 12, // Mocked value
          activeEnrollments: studentResponse.total * 3, // Mocked calculation
          totalSchedules: teacherResponse.total + studentResponse.total, // Mocked calculation
        };
      });
  }

  loadTeacherView(): void {
    // Teacher view logic (kept simple for this example)
    this.loading = false;
    // Teacher-specific stats can be populated here if needed
  }

  loadStudentView(): void {
    // Student view logic (kept simple for this example)
    this.loading = false;
  }
}
