import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

// Assuming these models and services exist in the correct paths
import { User, Student } from '../../models/user.model'; // Assuming Student extends or is similar to User
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';

// Interface matching the expected API list response
interface ListResponse<T> {
  data: T[];
  count: number;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  // Observable to hold the list of students
  students$: Observable<Student[]> = of([]);
  loading: boolean = true;
  errorMessage: string | null = null;
  deletingStudentId: string | null = null;
  currentUserRole: string | undefined;

  constructor(
    // CRITICAL FIX: Inject services and use @Inject for robustness
    @Inject(StudentService) private studentService: StudentService,
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check user role for access control
    const user: User | null = this.authService.currentUserValue;
    this.currentUserRole = user?.role;

    if (this.currentUserRole === 'admin' || this.currentUserRole === 'teacher') {
      this.loadStudents();
    } else {
      this.errorMessage = 'You do not have permission to view student information.';
      this.loading = false;
    }
  }

  /**
   * Fetches the list of students from the service.
   */
  loadStudents(): void {
    this.loading = true;
    this.errorMessage = null;

    // Call the service and map the response data
    this.students$ = this.studentService.getAllStudents().pipe(
      // Access the .data property of ListResponse<Student>
      // FIX: Use map to extract the actual array if needed later, but here we keep it simple for async pipe
      // If the service returns Observable<Student[]>, this step is simplified. Assuming ListResponse<Student>:

      catchError(error => {
        console.error('Error fetching students:', error);
        this.errorMessage = 'Failed to load student list.';
        // Return an empty observable to prevent the app from breaking
        return of({ data: [], count: 0 } as ListResponse<Student>);
      }),
      finalize(() => this.loading = false)
    ).pipe(
      // Extract the array for the template's async pipe
      // This is a common pattern when services return a paginated object
      // If your service returns Observable<Student[]>, remove this map step.
      (obs) => obs.pipe(
        // The type cast below helps the pipe sequence.
        // It's assumed the ListResponse type works here.
        // We'll trust the studentService returns the correct Observable.
        // If it returns ListResponse, we must map it:
        // map((response: ListResponse<Student>) => response.data)

        // For now, let's assume the service returns ListResponse and map it:
        (obs) => obs.pipe(
          // Ensure correct type usage if the service returns ListResponse
          (response: Observable<ListResponse<Student>>) => response.pipe(
            map(res => res.data)
          )
        )
      ) as Observable<Student[]>
    );
  }

  // NOTE: For simplicity, I've simplified the Observable chain. If StudentService.getAllStudents()
  // returns Observable<Student[]>, the map is unnecessary. Assuming it returns Observable<ListResponse<Student>>:

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = null;

    this.students$ = this.studentService.getAllStudents().pipe(
      catchError(error => {
        console.error('Error fetching students:', error);
        this.errorMessage = 'Failed to load student list.';
        return of({ data: [], count: 0 } as ListResponse<Student>);
      }),
      map(response => response.data), // FIX: Map ListResponse to Student[]
      finalize(() => this.loading = false)
    );
  }


  /**
   * Navigates to the form to edit an existing student.
   * @param studentId The ID of the student to edit.
   */
  editStudent(studentId: string | undefined): void {
    if (studentId) {
      this.router.navigate(['/students/edit', studentId]);
    }
  }

  /**
   * Handles the deletion of a student.
   * @param id The ID of the student to delete.
   */
  deleteStudent(id: string): void {
    if (!id || this.deletingStudentId) return;

    if (confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      this.deletingStudentId = id;
      this.studentService.deleteStudent(id)
        .pipe(
          finalize(() => this.deletingStudentId = null),
          catchError(error => {
            console.error('Deletion failed:', error);
            this.errorMessage = 'Failed to delete student. They may have active enrollments.';
            return of(null);
          })
        )
        .subscribe(() => {
          this.loadStudents(); // Reload list after successful deletion
        });
    }
  }
}
