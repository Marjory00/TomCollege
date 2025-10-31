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
    this.initForm();
  }

  ngOnInit(): void {
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
      courseCode: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z]{2,4}\d{3,5}$/)]], // e.g., CS101 or MATH2001
      creditHours: [3, [Validators.required, Validators.min(1), Validators.max(6)]],
      department: ['', Validators.required],
      description: ['', Validators.maxLength(500)]
    });
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

    // The Class model includes ID, which is only present in edit mode
    const classData: Class = {
        id: this.classId, // null in create mode
        ...formValue
    };

    let saveOperation: Observable<Class>;

    if (this.isEditMode && this.classId) {
      // Update existing class (full object with ID)
      saveOperation = this.classService.updateClass(classData);
    } else {
      // Create new class (using Omit<Class, 'id'> which is handled by the service signature)
      saveOperation = this.classService.createClass(formValue);
    }

    saveOperation
      .pipe(
        finalize(() => this.submitting = false),
        catchError(error => {
          console.error('Save failed:', error);
          this.errorMessage = `Failed to ${this.isEditMode ? 'update' : 'create'} class: ${error.message}`;
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
