import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, of, finalize, Observable } from 'rxjs';

import { Teacher, TeacherStatus } from '../../../models/teacher.model';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-add-edit-teacher',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-teacher.component.html',
  styleUrls: ['./add-edit-teacher.component.css']
})
export class AddEditTeacherComponent implements OnInit {

  teacherForm!: FormGroup;
  isEditMode: boolean = false;
  teacherId: string | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string | null = null;

  // Reference data for dropdowns (Assuming types are defined in the Teacher model)
  readonly departments: string[] = ['Science', 'Mathematics', 'Humanities', 'Engineering', 'Arts', 'Business'];
  readonly statuses: TeacherStatus[] = ['Active', 'On Leave', 'Terminated'];

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Check if we are in edit mode
    this.teacherId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.teacherId;

    if (this.isEditMode && this.teacherId) {
      this.loadTeacherData(this.teacherId);
    }
  }

  /**
   * Initializes the teacher form structure with validators.
   */
  private initForm(): void {
    this.teacherForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      // Use the current date as default for new teachers
      hireDate: [new Date().toISOString().substring(0, 10), Validators.required],
      status: ['Active', Validators.required]
    });
  }

  /**
   * Loads existing teacher data when in edit mode.
   * @param id The ID of the teacher to load.
   */
  loadTeacherData(id: string): void {
    this.loading = true;
    this.errorMessage = null;

    this.teacherService.getTeacherById(id)
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading teacher:', error);
          this.errorMessage = 'Failed to load teacher data.';
          return of(null);
        })
      )
      .subscribe((teacherData: Teacher | null) => {
        if (teacherData) {
          this.teacherForm.patchValue({
            ...teacherData,
            // Format Date object to YYYY-MM-DD string for input type="date"
            hireDate: new Date(teacherData.hireDate).toISOString().substring(0, 10)
          });
        } else {
          // Navigate away if data failed to load
          this.router.navigate(['/teachers']);
        }
      });
  }

  /**
   * Handles form submission: either creation or update.
   */
  onSubmit(): void {
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      this.errorMessage = 'Please fix the highlighted errors in the form.';
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const formValue = this.teacherForm.value;

    const teacherData: Teacher = {
        // ID is required on the full model, but null/empty for creation
        id: this.teacherId,
        ...formValue,
        // Ensure hireDate is sent as a Date object or proper string format
        hireDate: new Date(formValue.hireDate)
    };

    let saveOperation: Observable<Teacher>;

    if (this.isEditMode && this.teacherId) {
      // Update existing teacher
      saveOperation = this.teacherService.updateTeacher(teacherData);
    } else {
      // Create new teacher
      // The service signature handles the Omit<Teacher, 'id'> conversion
      saveOperation = this.teacherService.createTeacher(formValue);
    }

    saveOperation
      .pipe(
        finalize(() => this.submitting = false),
        catchError(error => {
          console.error('Save failed:', error);
          this.errorMessage = `Failed to ${this.isEditMode ? 'update' : 'create'} teacher: ${error.message}`;
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result) {
          console.log('Teacher saved successfully:', result);
          // Navigate back to the teacher list upon success
          this.router.navigate(['/teachers']);
        }
      });
  }

  /**
   * Navigates back to the teacher list.
   */
  cancel(): void {
    this.router.navigate(['/teachers']);
  }
}
