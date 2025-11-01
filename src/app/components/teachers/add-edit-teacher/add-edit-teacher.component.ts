// src/app/components/teachers/add-edit-teacher.component.ts

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // FIXED: DatePipe import removed
import { Subject, takeUntil, catchError, of, Observable, finalize } from 'rxjs';

import { TeacherService } from '../../../services/teacher.service';
import { Teacher, NewTeacherData } from '../../../models/teacher.model';

@Component({
  selector: 'app-add-edit-teacher',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // FIXED: DatePipe removed from imports array
  templateUrl: './add-edit-teacher.component.html',
  styleUrls: ['./add-edit-teacher.component.css']
})
export class AddEditTeacherComponent implements OnInit, OnDestroy {

  teacherForm!: FormGroup;
  isEditMode: boolean = false;
  teacherId: string | null = null;
  loading: boolean = true;
  submitting: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  departments = ['Mathematics', 'Science', 'English', 'History', 'Art', 'PE', 'Administration'];
  subjects = ['Calculus', 'Physics', 'Literature', 'World History', 'Sculpture', 'Gymnastics'];
  teacherStatuses: Teacher['status'][] = ['Active', 'Suspended', 'On Leave', 'Retired'];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(TeacherService) private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.teacherId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.teacherId;
    this.initializeForm();

    if (this.isEditMode && this.teacherId) {
      this.loadTeacherData(this.teacherId);
    } else {
      this.loading = false;
    }
  }

  private initializeForm(): void {
    this.teacherForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: ['', Validators.required],
      dateJoined: ['', Validators.required],
      subject: ['', Validators.required],
      password: ['', [this.isEditMode ? null : Validators.required, Validators.minLength(6)]],
      status: ['Active', Validators.required]
    });

    if (this.isEditMode) {
      this.teacherForm.controls['password'].disable();
    }
  }

  private loadTeacherData(id: string): void {
    this.teacherService.getTeacherById(id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false),
        catchError(error => {
          this.errorMessage = 'Failed to load teacher data.';
          return of(null);
        })
      )
      .subscribe((teacher: Teacher | null) => {
        if (teacher) {
          // Date formatting for the input type="date"
          const formattedDate = teacher.dateJoined
            ? new Date(teacher.dateJoined).toISOString().substring(0, 10)
            : null;

          this.teacherForm.patchValue({
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            phone: teacher.phone,
            department: teacher.department,
            dateJoined: formattedDate,
            subject: teacher.subject,
            status: teacher.status
          });
        } else {
          this.errorMessage = this.errorMessage || 'Teacher not found.';
          if(!this.errorMessage.includes('Failed to load')) this.router.navigate(['/teachers']);
        }
      });
  }

  onSubmit(): void {
    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      this.errorMessage = 'Please fix the validation errors.';
      this.submitting = false;
      return;
    }

    let saveOperation: Observable<Teacher | undefined>;
    const formData = this.teacherForm.getRawValue();

    if (!this.isEditMode) {
      const createData: NewTeacherData = {
        ...formData,
        dateJoined: new Date(formData.dateJoined).toISOString(),
        role: 'teacher',
      };
      saveOperation = this.teacherService.addTeacher(createData);
    } else {
      const updateData: Partial<Teacher> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        dateJoined: new Date(formData.dateJoined).toISOString(),
        subject: formData.subject,
        status: formData.status
      };
      saveOperation = this.teacherService.updateTeacher(this.teacherId!, updateData);
    }

    saveOperation
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.submitting = false),
        catchError((error: any) => {
          this.errorMessage = `Error saving teacher: ${error.message || 'Server error'}`;
          return of(undefined);
        })
      )
      .subscribe((result: Teacher | undefined) => {
        if (result) {
          this.successMessage = this.isEditMode ? 'Teacher updated successfully!' : 'Teacher added successfully!';
          this.router.navigate(['/teachers']);
        }
      });
  }

  get f() {
    return this.teacherForm.controls;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
