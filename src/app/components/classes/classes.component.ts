import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, catchError, of, finalize } from 'rxjs';

// Assuming these models and services exist
import { Class } from '../../models/class.model';
import { ClassService } from '../../services/class.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

// Interface for API list response
interface ListResponse<T> {
  data: T[];
  count: number;
}

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  classes: Class[] = [];
  loading: boolean = true;
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
      this.errorMessage = 'You do not have permission to view this page.';
      this.loading = false;
    }
  }

  loadClasses(): void {
    this.loading = true;
    this.errorMessage = null;

    this.classService.getAllClasses()
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error fetching classes:', error);
          this.errorMessage = 'Failed to load class list. Please check the network.';
          return of({ data: [], count: 0 } as ListResponse<Class>);
        })
      )
      .subscribe({
        next: (response: ListResponse<Class>) => {
          this.classes = response.data;
        },
        error: (err) => {
          console.error('Subscription error:', err);
        }
      });
  }

  addClass(): void {
    this.router.navigate(['/classes/new']);
  }

  /**
   * Navigate to the detail/edit view for a specific class.
   * FIX: Added type guard to ensure classId is a string before routing.
   * @param classId The ID of the class to edit (can be string or undefined).
   */
  editClass(classId: string | undefined): void { //  FIX 1: Change the parameter type to accept 'string | undefined'
    if (classId) { // FIX 2: Check if classId exists before navigating
      this.router.navigate(['/classes/edit', classId]);
    } else {
      console.warn('Attempted to edit a class with no ID.');
      // Optionally show a user error message here
    }
  }
}
