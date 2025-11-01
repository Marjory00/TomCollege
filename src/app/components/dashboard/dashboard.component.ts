// src/app/components/dashboard/dashboard.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe, DecimalPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, finalize, catchError, of, forkJoin } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { TeacherService } from '../../services/teacher.service';
import { StudentService } from '../../services/student.service';
import { User } from '../../models/user.model';
import { Teacher } from '../../models/teacher.model';
import { Student } from '../../models/student.model';
import { ApiResponse } from '../../models/api-response.model';

// Use ApiResponse<T> everywhere for consistency (Mocked interfaces removed)

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
  imports: [CommonModule, RouterModule, TitleCasePipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: User | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;

  stats: DashboardStats = {
    totalClasses: 0,
    totalStudents: 0,
    activeEnrollments: 0,
    totalSchedules: 0,
  };

  dashboardItems: DashboardItem[] = [
    { title: 'Manage Students', icon: 'fas fa-user-graduate', link: '/students', roles: ['admin', 'teacher'] },
    { title: 'Manage Teachers', icon: 'fas fa-chalkboard-teacher', link: '/teachers', roles: ['admin'] },
    { title: 'Manage Classes', icon: 'fas fa-book', link: '/classes', roles: ['admin', 'teacher'] },
    { title: 'System Settings', icon: 'fas fa-cog', link: '/settings', roles: ['admin'] },
    { title: 'View My Schedule', icon: 'fas fa-calendar-alt', link: '/schedule', roles: ['student', 'teacher'] },
  ];

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  canViewItem(requiredRoles: User['role'][]): boolean {
    if (!this.currentUser) return false;
    return requiredRoles.includes(this.currentUser.role);
  }

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
      catchError(error => { console.error('Error loading teachers:', error); return of({ data: [], total: 0, page: 1, limit: 0 } as ApiResponse<Teacher>); })
    );

    const students$ = this.studentService.getStudents().pipe(
      catchError(error => { console.error('Error loading students:', error); return of({ data: [], total: 0, page: 1, limit: 0 } as ApiResponse<Student>); })
    );

    // FIX: Use the correct ApiResponse types for DashboardResponses
    type DashboardResponses = [ApiResponse<Teacher>, ApiResponse<Student>];

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

        // Data access uses the standardized 'total' property
        this.stats = {
          totalStudents: studentResponse.total,
          totalClasses: 12, // Mocked value
          activeEnrollments: studentResponse.total * 3, // Mocked calculation
          totalSchedules: teacherResponse.total + studentResponse.total, // Mocked calculation
        };
      });
  }

  loadTeacherView(): void {
    this.loading = false;
  }

  loadStudentView(): void {
    this.loading = false;
  }
}
