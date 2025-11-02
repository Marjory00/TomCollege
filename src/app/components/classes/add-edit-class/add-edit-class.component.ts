// src/app/components/placeholder/classes/add-edit-class.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, of, finalize, Observable } from 'rxjs'; // Note: Observable is no longer strictly needed but kept

// FIX 1: Define a basic Class interface to resolve type errors
// NOTE: This should be moved to 'src/app/models/class.model.ts' when implemented
interface Class {
    id: string;
    name: string;
    courseCode: string;
    creditHours: number;
    department: string;
    description: string;
}

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
    private router: Router,
    private route: ActivatedRoute
    // FIX 2: ClassService dependency removed
  ) {}

  ngOnInit(): void {
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

    // FIX 3: Replaced classService call with a mock setTimeout
    setTimeout(() => {
        this.loading = false;
        if (id === '123') { // Mock success for a specific ID
            const mockClass: Class = {
                id: id,
                name: 'Introduction to Angular',
                courseCode: 'CS101',
                creditHours: 3,
                department: 'Science',
                description: 'Fundamentals of web application development with Angular.'
            };
            this.classForm.patchValue(mockClass);
        } else {
            console.error('Mock Error: Class not found.');
            this.errorMessage = 'Failed to load class data. (Mock Error)';
            this.router.navigate(['/classes']);
        }
    }, 1000); // Simulate API delay
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

    // FIX 4: Replaced saveOperation logic with a mock setTimeout
    setTimeout(() => {
        this.submitting = false;

        // Mock success
        console.log(`Class ${this.isEditMode ? 'updated' : 'created'} successfully:`, this.classForm.value);
        this.router.navigate(['/classes']);

    }, 1000); // Simulate API delay
  }

  /**
   * Navigates back to the class list.
   */
  cancel(): void {
    this.router.navigate(['/classes']);
  }
}
