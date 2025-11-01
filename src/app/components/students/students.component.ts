// src/app/components/students/students.component.ts

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, catchError, of, finalize } from 'rxjs';

import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
// Assuming ApiResponse is here
// import { ApiResponse } from '../../models/user.model';

// Define the expected structure for API response when fetching a list
interface StudentListResponse {
  students: Student[];
  total: number;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit, OnDestroy {

  students: Student[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  totalStudents: number = 0;

  // Pagination/Filtering properties
  currentPage: number = 1;
  pageSize: number = 10;

  private destroy$ = new Subject<void>();

  constructor(
    @Inject(StudentService) private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  /**
   * Loads the list of students from the service.
   */
  loadStudents(): void {
    this.loading = true;
    this.errorMessage = null;

    const params = { page: this.currentPage, size: this.pageSize };

    this.studentService.getStudents(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading students:', error);
          this.errorMessage = 'Failed to load student data. Please try again later.';
          return of({ students: [], total: 0 } as StudentListResponse);
        })
      )
      .subscribe((response: StudentListResponse) => {
          this.students = response.students;
          this.totalStudents = response.total;
      });
  }

  /**
   * CRITICAL FIX: Function to determine the CSS class based on student status.
   * This simplifies the template binding and avoids complex type checking errors.
   */
  getStatusClass(status: Student['status']): string {
    switch (status) {
      case 'Active':
      case 'Graduated':
        return 'bg-success';
      case 'Suspended':
        return 'bg-warning text-dark';
      case 'Withdrawn':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark'; // Fallback
    }
  }

  /**
   * Deletes a student and reloads the list upon success.
   * @param id The ID of the student to delete.
   */
  deleteStudent(id: string): void {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      this.loading = true;
      this.studentService.deleteStudent(id)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.loading = false),
          catchError(error => {
            console.error('Deletion failed:', error);
            this.errorMessage = 'Failed to delete student.';
            return of(null);
          })
        )
        .subscribe(() => {
          this.loadStudents();
        });
    }
  }

  // Placeholder for pagination control action
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
