// src/app/components/students/add-edit-student/add-edit-student.component.ts

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, catchError, of, Observable, finalize } from 'rxjs';

import { StudentService } from '../../../services/student.service';
import { Student, NewStudentData } from '../../../models/student.model';

@Component({
  selector: 'app-add-edit-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.css']
})
export class AddEditStudentComponent implements OnInit, OnDestroy {

  studentForm!: FormGroup;
  isEditMode: boolean = false;
  studentId: string | null = null;
  loading: boolean = true;
  submitting: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Dropdown data
  classes = ['Grade 10A', 'Grade 10B', 'Grade 11A', 'Grade 11B', 'Grade 12A', 'Grade 12B'];
  studentStatuses: Student['status'][] = ['Active', 'On Probation', 'Suspended', 'Graduated', 'Withdrawn'];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(StudentService) private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.studentId;
    this.initializeForm();

    if (this.isEditMode && this.studentId) {
      this.loadStudentData(this.studentId);
    } else {
      this.loading = false;
    }
  }

  private initializeForm(): void {
    this.studentForm = this.fb.group({
      studentId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      currentClass: ['', Validators.required],
      enrollmentDate: ['', Validators.required],
      password: ['', [this.isEditMode ? null : Validators.required, Validators.minLength(6)]],
      status: ['Active', Validators.required]
    });

    // Student ID and password should not be editable by default in edit mode
    if (this.isEditMode) {
      this.studentForm.controls['studentId'].disable();
      this.studentForm.controls['password'].disable();
    }
  }

  private loadStudentData(id: string): void {
    this.studentService.getStudentById(id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false),
        catchError(error => {
          this.errorMessage = 'Failed to load student data.';
          return of(null);
        })
      )
      .subscribe((student: Student | null) => {
        if (student) {
          // Format date for HTML input[type=date]
          const formattedDate = student.enrollmentDate
            ? new Date(student.enrollmentDate).toISOString().substring(0, 10)
            : null;

          this.studentForm.patchValue({
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            phone: student.phone,
            currentClass: student.currentClass,
            enrollmentDate: formattedDate,
            status: student.status
          });
        } else {
          this.errorMessage = this.errorMessage || 'Student not found.';
          if(!this.errorMessage.includes('Failed to load')) this.router.navigate(['/students']);
        }
      });
  }

  onSubmit(): void {
    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.errorMessage = 'Please fix the validation errors.';
      this.submitting = false;
      return;
    }

    let saveOperation: Observable<Student | undefined>;
    // Use getRawValue() to include disabled controls like studentId
    const formData = this.studentForm.getRawValue();

    if (!this.isEditMode) {
      const createData: NewStudentData = {
        ...formData,
        enrollmentDate: new Date(formData.enrollmentDate).toISOString(),
        role: 'student',
      };
      saveOperation = this.studentService.addStudent(createData);
    } else {
      const updateData: Partial<Student> = {
        // Exclude studentId and password from updates if they are disabled/unchanged
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        currentClass: formData.currentClass,
        enrollmentDate: new Date(formData.enrollmentDate).toISOString(),
        status: formData.status
      };
      saveOperation = this.studentService.updateStudent(this.studentId!, updateData);
    }

    saveOperation
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.submitting = false),
        catchError((error: any) => {
          this.errorMessage = `Error saving student: ${error.message || 'Server error'}`;
          return of(undefined);
        })
      )
      .subscribe((result: Student | undefined) => {
        if (result) {
          this.successMessage = this.isEditMode ? 'Student updated successfully!' : 'Student added successfully!';
          this.router.navigate(['/students']);
        }
      });
  }

  get f() {
    return this.studentForm.controls;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
