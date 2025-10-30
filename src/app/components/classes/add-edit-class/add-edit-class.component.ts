import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // RouterLink added here
import { first } from 'rxjs/operators';

import { ClassService } from '../../../services/class.service';
import { Class } from '../../../models/class.model';

@Component({
  selector: 'app-add-edit-class',
  standalone: true,
  // FIX: RouterLink is explicitly imported for use in the template
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-edit-class.component.html',
  styleUrls: ['./add-edit-class.component.css']
})
export class AddEditClassComponent implements OnInit {
  classForm!: FormGroup;
  loading = false;
  submitted = false;
  isEditMode = false;
  classId: string | null = null;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    // 1. Determine if we are adding or editing
    this.classId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.classId;

    // 2. Initialize the form with validation
    this.classForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{3,10}$')]],
      teacherId: ['', Validators.required],
      description: ['', Validators.maxLength(500)]
    });

    // 3. Load existing class data if in edit mode
    if (this.isEditMode) {
      this.loading = true;
      this.classService.getClassById(this.classId!)
        .pipe(first())
        .subscribe({
          next: (classData) => {
            this.classForm.patchValue(classData);
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load class data.';
            this.loading = false;
            console.error(err);
          }
        });
    }
  }

  /**
   * Helper getter to easily access form controls in the template.
   */
  get f() {
    return this.classForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Stop if form is invalid
    if (this.classForm.invalid) {
      return;
    }

    this.loading = true;

    // Delegate to the appropriate save method
    if (this.isEditMode) {
      this.updateClass();
    } else {
      this.createClass();
    }
  }

  private createClass(): void {
    this.classService.createClass(this.classForm.value as Class)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/classes'], { state: { message: 'Class created successfully!' } });
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to create class.';
          this.loading = false;
        }
      });
  }

  private updateClass(): void {
    const classToUpdate = { ...this.classForm.value, id: this.classId };

    this.classService.updateClass(classToUpdate as Class)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/classes'], { state: { message: 'Class updated successfully!' } });
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to update class.';
          this.loading = false;
        }
      });
  }
}
