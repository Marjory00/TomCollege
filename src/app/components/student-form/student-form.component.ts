import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// FIX APPLIED: Added Observable to the rxjs import
import { catchError, of, finalize, Observable } from 'rxjs';

// Assuming these models and services exist
import { Student, EnrollmentStatus } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {

  studentForm!: FormGroup;
  isEditMode: boolean = false;
  studentId: string | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string | null = null;

  // Expose the allowed enrollment statuses for the template select dropdown
  enrollmentStatuses: EnrollmentStatus[] = ['Enrolled', 'Graduated', 'On Leave', 'Suspended'];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Check if we are in edit mode by looking for an 'id' parameter in the route
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.studentId;

    if (this.isEditMode && this.studentId) {
      this.loadStudentData(this.studentId);
    }
  }

  /**
   * Initializes the student form structure with validators.
   */
  private initForm(): void {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required], // Date input
      enrollmentStatus: ['Enrolled', Validators.required] // Default to 'Enrolled'
    });
  }

  /**
   * Loads existing student data when in edit mode.
   * @param id The ID of the student to load.
   */
  loadStudentData(id: string): void {
    this.loading = true;
    this.studentService.getStudent(id)
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading student:', error);
          this.errorMessage = 'Failed to load student data.';
          return of(null);
        })
      )
      .subscribe((student: Student | null) => {
        if (student) {
          // Note: Date formatting might be necessary depending on your API/backend date string format
          // Assuming the dateOfBirth from the API is a Date object or compatible string
          this.studentForm.patchValue({
            ...student,
            // Format Date object to YYYY-MM-DD string for input type="date"
            dateOfBirth: student.dateOfBirth instanceof Date ? student.dateOfBirth.toISOString().substring(0, 10) : student.dateOfBirth
          });
        } else {
          // Navigate away if data failed to load
          this.router.navigate(['/students']);
        }
      });
  }

  /**
   * Handles form submission: either creation or update.
   */
  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const formValue = this.studentForm.value;
    const studentData: Student = {
        // Assume ID is only required on the model for API interaction, not for form input
        id: this.studentId || '',
        ...formValue,
        // Ensure dateOfBirth is sent back as a Date object or proper string format if required by API
        dateOfBirth: new Date(formValue.dateOfBirth)
    };

    // The line below requires the Observable import
    let saveOperation: Observable<Student>;

    if (this.isEditMode && this.studentId) {
      // Update existing student
      saveOperation = this.studentService.updateStudent(this.studentId, studentData);
    } else {
      // Create new student
      saveOperation = this.studentService.createStudent(studentData);
    }

    saveOperation
      .pipe(
        finalize(() => this.submitting = false),
        catchError(error => {
          console.error('Save failed:', error);
          this.errorMessage = `Failed to ${this.isEditMode ? 'update' : 'create'} student. Please check the form and try again.`;
          return of(null); // Return empty observable to keep subscription alive
        })
      )
      .subscribe((result) => {
        if (result) {
          console.log('Student saved successfully:', result);
          // Navigate back to the student list upon success
          this.router.navigate(['/students']);
        }
      });
  }

  /**
   * Navigates back to the student list.
   */
  cancel(): void {
    this.router.navigate(['/students']);
  }
}
