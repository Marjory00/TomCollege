import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, of, finalize, Observable } from 'rxjs';
import { Class } from '../../../models/class.model';
import { ClassService } from '../../../services/class.service';

@Component({
  selector: 'app-add-edit-class',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-class.component.html',
  styleUrls: ['./add-edit-class.component.css']
})
export class AddEditClassComponent implements OnInit {

  classForm!: FormGroup;
  isEditMode: boolean = false;
  classId: string | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string | null = null;

  // List of possible departments for a dropdown
  readonly departments: string[] = ['Science', 'Mathematics', 'Humanities', 'Engineering', 'Arts', 'Business'];

  constructor(
    private fb: FormBuilder,
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Moved form initialization to ngOnInit for better lifecycle adherence
  }

  ngOnInit(): void {
    // FIX 1: Initialize form first, before checking route params
    this.initForm();

    // Check for an 'id' parameter to determine if we are in edit mode
    this.classId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.classId;

    if (this.isEditMode && this.classId) {
      this.loadClassData(this.classId);
    }
  }

  /**
   * Initializes the class form structure with validators.
   */
  private initForm(): void {
    this.classForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      // Regex pattern check is correct: /^[A-Z]{2,4}\d{3,5}$/
      courseCode: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]{2,4}\d{3,5}$/)]],
      creditHours: [3, [Validators.required, Validators.min(1), Validators.max(6)]],
      department: ['', Validators.required],
      description: ['', Validators.maxLength(500)]
    });
  }

  /**
   * Convenience getter for easy access to form fields.
   */
  get f() {
    return this.classForm.controls;
  }

  /**
   * Loads existing class data when in edit mode.
   * @param id The ID of the class to load.
   */
  loadClassData(id: string): void {
    this.loading = true;
    this.errorMessage = null;

    this.classService.getClassById(id)
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading class:', error);
          this.errorMessage = 'Failed to load class data.';
          return of(null);
        })
      )
      .subscribe((classData: Class | null) => {
        if (classData) {
          // Patch the form with the retrieved data
          this.classForm.patchValue(classData);
        } else {
          // Navigate away if data failed to load
          this.router.navigate(['/classes']);
        }
      });
  }

  /**
   * Handles form submission: either creation or update.
   */
  onSubmit(): void {
    if (this.classForm.invalid) {
      this.classForm.markAllAsTouched();
      this.errorMessage = 'Please fix the highlighted errors in the form.';
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const formValue = this.classForm.value;

    let saveOperation: Observable<Class>;

    if (this.isEditMode && this.classId) {
      // FIX 2: Construct the full Class object with ID for update
      const classData: Class = {
          id: this.classId,
          ...formValue
      };
      saveOperation = this.classService.updateClass(classData);
    } else {
      // FIX 3: Pass just the form value (which aligns with Omit<Class, 'id'>) for creation
      saveOperation = this.classService.createClass(formValue);
    }

    saveOperation
      .pipe(
        finalize(() => this.submitting = false),
        catchError(error => {
          console.error('Save failed:', error);
          // Use a default message if error object is not well-structured
          const specificError = error.error?.message || error.message;
          this.errorMessage = `Failed to ${this.isEditMode ? 'update' : 'create'} class: ${specificError}`;
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result) {
          console.log('Class saved successfully:', result);
          // Navigate back to the class list upon success
          this.router.navigate(['/classes']);
        }
      });
  }

  /**
   * Navigates back to the class list.
   */
  cancel(): void {
    this.router.navigate(['/classes']);
  }
}
