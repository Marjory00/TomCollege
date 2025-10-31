import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, catchError, finalize } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { TeacherService } from '../../services/teacher.service';
import { AuthService } from '../../services/auth.service';
// Assuming a Teacher model exists with common properties
import { Teacher } from '../../models/teacher.model';
import { User } from '../../models/user.model';

// Interface matching the expected API list response
interface ListResponse<T> {
  data: T[];
  count: number;
}

@Component({
  selector: 'app-teachers',
  standalone: true,
  // Ensure necessary modules are imported
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

  teachers: Teacher[] = [];
  totalTeachers: number = 0;
  loading: boolean = true;
  deletingTeacherId: string | null = null;
  errorMessage: string | null = null;
  currentUserRole: string | undefined;

  constructor(
    private teacherService: TeacherService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Determine the user's role for template permissions (only Admins can usually manage staff)
    const user: User | null = this.authService.currentUserValue;
    this.currentUserRole = user?.role;

    // Only Administrators are typically allowed to view/manage all staff
    if (this.currentUserRole === 'admin') {
      this.loadTeachers();
    } else {
      this.errorMessage = 'You must be an administrator to view or manage the teacher roster.';
      this.loading = false;
    }
  }

  /**
   * Fetches the list of teachers from the service.
   */
  loadTeachers(): void {
    this.loading = true;
    this.errorMessage = null;

    this.teacherService.getAllTeachers()
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error fetching teachers:', error);
          this.errorMessage = 'Failed to load teacher list. Please check the network or server.';
          // Return a mock response on error
          return of({ data: [], count: 0 } as ListResponse<Teacher>);
        })
      )
      .subscribe({
        next: (response: ListResponse<Teacher>) => {
          this.teachers = response.data;
          this.totalTeachers = response.count;
        },
        error: (err) => {
          console.error('Subscription error:', err);
        }
      });
  }

  /**
   * Navigates to the form to add a new teacher.
   */
  addTeacher(): void {
    this.router.navigate(['/teachers/add']);
  }

  /**
   * Navigates to the form to edit an existing teacher.
   * @param teacherId The ID of the teacher to edit.
   */
  editTeacher(teacherId: string | undefined): void {
    if (teacherId) {
      this.router.navigate(['/teachers/edit', teacherId]);
    } else {
      console.warn('Attempted to edit a teacher with no ID.');
    }
  }

  /**
   * Handles the deletion of a teacher.
   * @param teacherId The ID of the teacher to delete.
   */
  deleteTeacher(teacherId: string | undefined): void {
    if (!teacherId || this.deletingTeacherId) return;

    if (confirm('WARNING: Are you sure you want to delete this teacher? This action may affect associated schedules and classes.')) {
      this.deletingTeacherId = teacherId;
      this.teacherService.deleteTeacher(teacherId)
        .pipe(
          finalize(() => this.deletingTeacherId = null),
          catchError(error => {
            console.error('Deletion failed:', error);
            this.errorMessage = 'Failed to delete teacher. They may still be linked to active classes/schedules.';
            return of(null);
          })
        )
        .subscribe(() => {
          // Successfully deleted, refresh the list
          this.loadTeachers();
        });
    }
  }
}
