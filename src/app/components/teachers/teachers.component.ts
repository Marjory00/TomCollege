// src/app/components/teachers/teachers.component.ts

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, catchError, of, finalize } from 'rxjs';

import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher.model';

// Re-define the expected response type for clarity
interface TeacherListResponse {
  teachers: Teacher[];
  total: number;
}

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit, OnDestroy {
getStatusClass(arg0: any): string|string[]|Set<string>|{ [klass: string]: any; }|null|undefined {
throw new Error('Method not implemented.');
}

  teachers: Teacher[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  totalTeachers: number = 0;

  // Pagination/Filtering properties (if needed)
  currentPage: number = 1;
  pageSize: number = 10;

  private destroy$ = new Subject<void>();

  constructor(
    @Inject(TeacherService) private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  /**
   * Loads the list of teachers from the service.
   */
  loadTeachers(): void {
    this.loading = true;
    this.errorMessage = null;

    // Optional: Include pagination parameters in the service call
    const params = { page: this.currentPage, size: this.pageSize };

    this.teacherService.getTeachers(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading teachers:', error);
          this.errorMessage = 'Failed to load teacher data. Please try again later.';
          // Return a structured fallback response on error
          return of({ teachers: [], total: 0 } as TeacherListResponse);
        })
      )
      // CRITICAL FIX: Use the positional callback syntax (value, error, complete)
      .subscribe(
        // Success callback (value)
        (response: TeacherListResponse) => {
          this.teachers = response.teachers;
          this.totalTeachers = response.total;
        }
        // Error handling is managed by the catchError pipe, so a dedicated error callback is optional here
      );
  }

  /**
   * Deletes a teacher and reloads the list upon success.
   * @param id The ID of the teacher to delete.
   */
  deleteTeacher(id: string): void {
    if (confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      this.loading = true;
      this.teacherService.deleteTeacher(id)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.loading = false),
          catchError(error => {
            console.error('Deletion failed:', error);
            this.errorMessage = 'Failed to delete teacher.';
            return of(null);
          })
        )
        // CRITICAL FIX: Use the positional callback syntax
        .subscribe(() => {
          // Only reload if the deletion was successful (i.e., not an error result)
          this.loadTeachers();
        });
    }
  }

  // Placeholder for pagination control action
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTeachers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
