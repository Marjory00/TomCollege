// src/app/components/schedules/add-edit-schedule/add-edit-schedule.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, of, finalize, Observable } from 'rxjs';

import { Schedule } from '../../../models/schedule.model';

@Component({
  selector: 'app-add-edit-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-schedule.component.html',
  styleUrls: ['./add-edit-schedule.component.css']
})
export class AddEditScheduleComponent implements OnInit {

  scheduleForm!: FormGroup;
  isEditMode: boolean = false;
  scheduleId: string | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string | null = null;

  // Mock data for dropdowns
  readonly days: Schedule['dayOfWeek'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  readonly mockCourses: { id: string, code: string }[] = [
      { id: '1', code: 'CS101' },
      { id: '2', code: 'MATH205' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
    // ScheduleService dependency removed, using mock logic
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.scheduleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.scheduleId;

    if (this.isEditMode && this.scheduleId) {
      this.loadScheduleData(this.scheduleId);
    }
  }

  private initForm(): void {
    this.scheduleForm = this.fb.group({
      studentId: ['', Validators.required],
      teacherId: ['', Validators.required],
      courseId: ['', Validators.required],
      dayOfWeek: ['', Validators.required],
      timeSlot: ['', Validators.required],
    });
  }

  /**
   * Loads existing schedule data when in edit mode (MOCK).
   */
  loadScheduleData(id: string): void {
    this.loading = true;
    this.errorMessage = null;

    setTimeout(() => {
        this.loading = false;
        if (id === 'SCH1' || id === 'S001') {
            const mockSchedule: Schedule = {
                id: id,
                studentId: 'S456',
                teacherId: 'T101',
                courseId: '2', // MATH205
                dayOfWeek: 'Tuesday',
                timeSlot: '1:00 PM - 2:30 PM',

                // Placeholder values for the rich Schedule model:
                className: 'Mock Math Class',
                location: 'Room 101',
                days: ['Tue', 'Thu'],
                startTime: '01:00 PM',
                endTime: '02:30 PM',
                term: 'Spring',
                year: 2025,
                notes: 'Edited slot.'
            };

            this.scheduleForm.patchValue(mockSchedule);
        } else {
            console.error('Mock Error: Schedule not found.');
            this.errorMessage = 'Failed to load schedule data. (Mock Error)';
            this.router.navigate(['/schedules']);
        }
    }, 1000);
  }

  /**
   * Handles form submission (MOCK).
   */
  onSubmit(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      this.errorMessage = 'Please fix the highlighted errors in the form.';
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    setTimeout(() => {
        this.submitting = false;

        console.log(`Schedule ${this.isEditMode ? 'updated' : 'created'} successfully:`, this.scheduleForm.value);

        this.router.navigate(['/schedules']);

    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/schedules']);
  }
}
