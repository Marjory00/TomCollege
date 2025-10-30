import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

// Assuming these models and services exist
import { User } from '../../models/user.model';
import { Student } from '../../models/student.model'; // Assuming a Student model exists
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';

// Interface for API list response
interface ListResponse<T> {
  data: T[];
  count: number;
}

@Component({
  selector: 'app-students',
  standalone: true,
  // Ensure necessary modules are imported
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students: Student[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  currentUserRole: string | undefined;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the synchronous user object for immediate role check
    // Uses the established 'currentUserValue' property from AuthService
    const user: User | null = this.authService.currentUserValue;
    this.currentUserRole = user?.role;

    // Only Admin and Teacher roles are typically allowed to view the full student roster
    if (this.currentUserRole === 'admin' || this.currentUserRole === 'teacher') {
      this.loadStudents();
    } else {
      // Handle unauthorized access
      this.errorMessage = 'You do not have permission to view the full student roster.';
      this.loading = false;
    }
  }

  /**
   * Fetches the list of students from the service.
   */
  loadStudents(): void {
    this.loading = true;
    this.errorMessage = null;

    this.studentService.getAllStudents()
      .pipe(
        // Ensure loading state is turned off on completion or error
        finalize(() => this.loading = false),
        // Catch errors and return an empty list to prevent stream breakage
        catchError(error => {
          console.error('Error fetching students:', error);
          this.errorMessage = 'Failed to load student list. Please check the network.';
          // Return a mock response to ensure the subscription completes successfully
          return of({ data: [], count: 0 } as ListResponse<Student>);
        })
      )
      .subscribe({
        next: (response: ListResponse<Student>) => {
          this.students = response.data;
        },
        error: (err) => {
          console.error('Subscription error:', err);
        }
      });
  }

  /**
   * Navigate to the form to add a new student.
   */
  addStudent(): void {
    this.router.navigate(['/students/new']);
  }

  /**
   * Navigate to the detail/edit view for a specific student.
   * Uses a type guard to safely handle optional IDs.
   * @param studentId The ID of the student (can be string or undefined).
   */
  editStudent(studentId: string | undefined): void {
    if (studentId) {
      this.router.navigate(['/students/edit', studentId]);
    } else {
      console.warn('Attempted to edit a student with no ID.');
    }
  }
}
