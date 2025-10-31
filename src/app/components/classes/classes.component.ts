import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, catchError, finalize } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ClassService } from '../../services/class.service';
import { AuthService } from '../../services/auth.service';
import { Class } from '../../models/class.model';
import { User } from '../../models/user.model';

// Interface matching the expected API list response
interface ListResponse<T> {
  data: T[];
  count: number;
}

@Component({
  selector: 'app-classes',
  standalone: true,
  // Ensure necessary modules are imported
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  classes: Class[] = [];
  // FIX APPLIED: Declare and initialize the missing property
  totalClasses: number = 0;
  loading: boolean = true;
  deletingClassId: string | null = null;
  errorMessage: string | null = null;
  currentUserRole: string | undefined;

  constructor(
    private classService: ClassService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user: User | null = this.authService.currentUserValue;
    this.currentUserRole = user?.role;

    if (this.currentUserRole === 'admin' || this.currentUserRole === 'teacher') {
      this.loadClasses();
    } else {
      this.errorMessage = 'You do not have permission to view class information.';
      this.loading = false;
    }
  }

  /**
   * Fetches the list of classes from the service.
   */
  loadClasses(): void {
    this.loading = true;
    this.errorMessage = null;

    this.classService.getAllClasses()
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error fetching classes:', error);
          this.errorMessage = 'Failed to load class list. Please check the network or server.';
          return of({ data: [], count: 0 } as ListResponse<Class>);
        })
      )
      .subscribe({
        next: (response: ListResponse<Class>) => {
          this.classes = response.data;
          // Ensure the totalClasses property is set from the API response
          this.totalClasses = response.count;
        },
        error: (err) => {
          console.error('Subscription error:', err);
        }
      });
  }

  // ... (rest of the component methods remain the same) ...

  /**
   * Navigates to the form to add a new class.
   */
  addClass(): void {
    this.router.navigate(['/classes/add']);
  }

  /**
   * Navigates to the form to edit an existing class.
   * @param classId The ID of the class to edit.
   */
  editClass(classId: string | undefined): void {
    if (classId) {
      this.router.navigate(['/classes/edit', classId]);
    } else {
      console.warn('Attempted to edit a class with no ID.');
    }
  }

  /**
   * Handles the deletion of a class.
   * @param classId The ID of the class to delete.
   */
  deleteClass(classId: string | undefined): void {
    if (!classId || this.deletingClassId) return;

    if (confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      this.deletingClassId = classId;
      this.classService.deleteClass(classId)
        .pipe(
          finalize(() => this.deletingClassId = null),
          catchError(error => {
            console.error('Deletion failed:', error);
            this.errorMessage = 'Failed to delete class. It may have active schedules or dependencies.';
            return of(null);
          })
        )
        .subscribe(() => {
          this.loadClasses();
        });
    }
  }
}
