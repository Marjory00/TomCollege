import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Added FormsModule for search input

// Assuming these models and services exist
import { User } from '../../models/user.model';
import { Student } from '../../models/student.model';
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
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students: Student[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  currentUserRole: string | undefined;

  // --- Pagination and Filtering State ---
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  searchTerm: string = '';
  sortBy: string = 'lastName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the synchronous user object for immediate role check
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
   * Fetches the list of students from the service, incorporating pagination and filtering.
   */
  loadStudents(): void {
    this.loading = true;
    this.errorMessage = null;

    // IMPORTANT: Use all pagination/search parameters in the service call
    this.studentService.getAllStudents(this.currentPage, this.pageSize, this.searchTerm, this.sortBy, this.sortDirection)
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
          this.totalItems = response.count;
        },
        error: (err) => {
          // This block typically catches errors from `of` stream or final stream failure
          console.error('Subscription error:', err);
        }
      });
  }

  // --- Template Helper Method (Fix for 'min' pipe error) ---

  /**
   * Calculates the index of the last item displayed on the current page.
   * This is used in the template to correctly display the pagination range (e.g., 'Showing 1-10').
   */
  getEndingIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  // --- UI/Data Interaction Methods ---

  /**
   * Event handler for search input or filter changes.
   */
  onSearch(): void {
    this.currentPage = 1; // Reset to first page on new search
    this.loadStudents();
  }

  /**
   * Event handler for column header click (sorting).
   */
  onSort(column: string): void {
    if (this.sortBy === column) {
      // Toggle direction if clicking the same column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.loadStudents();
  }

  /**
   * Event handler for pagination (next/previous page).
   */
  onPageChange(page: number): void {
    const maxPage = Math.ceil(this.totalItems / this.pageSize);
    if (page > 0 && page <= maxPage) {
      this.currentPage = page;
      this.loadStudents();
    }
  }

  /**
   * Navigate to the form to add a new student.
   */
  addStudent(): void {
    this.router.navigate(['/students/new']);
  }

  /**
   * Navigate to the detail/edit view for a specific student.
   */
  editStudent(studentId: string | undefined): void {
    if (studentId) {
      this.router.navigate(['/students/edit', studentId]);
    } else {
      console.warn('Attempted to edit a student with no ID.');
    }
  }

  /**
   * Placeholder for student deletion logic.
   */
  deleteStudent(studentId: string | undefined): void {
      if (studentId && confirm('Are you sure you want to delete this student?')) {
          // Implementation of delete logic would go here, followed by loadStudents()
          console.log(`Deleting student with ID: ${studentId}`);
      }
  }
}
