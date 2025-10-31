import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  AbstractControl, // <-- Import AbstractControl
  ValidatorFn      // <-- Import ValidatorFn for proper typing
} from '@angular/forms';
import { catchError, of, finalize, Observable, forkJoin } from 'rxjs';
import { Schedule, DayOfWeek, Term } from '../../models/schedule.model';
import { ScheduleService } from '../../services/schedule.service';

// Assuming simplified models exist for reference data
interface ClassReference {
  id: string;
  name: string;
}
interface TeacherReference {
  id: string;
  name: string;
}

// Assuming these services exist (for demonstration)
// import { ClassService } from '../../services/class.service';
// import { TeacherService } from '../../services/teacher.service';

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
  loading: boolean = true;
  submitting: boolean = false;
  errorMessage: string | null = null;

  // Reference Data for Dropdowns
  availableClasses: ClassReference[] = [];
  availableTeachers: TeacherReference[] = [];

  // Expose types for template iteration
  readonly allDays: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly allTerms: Term[] = ['Fall', 'Spring', 'Summer', 'Winter'];

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private router: Router,
    private route: ActivatedRoute,
    // private classService: ClassService, // Assuming these services are injected
    // private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.scheduleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.scheduleId;

    // Load reference data (classes and teachers)
    this.loadReferenceData();
  }

  /**
   * Initializes the form structure with validators.
   */
  private initForm(schedule?: Schedule): void {
    const initialDays = schedule?.days || [];

    this.scheduleForm = this.fb.group({
      // Core Data
      classId: [schedule?.classId || '', Validators.required],
      teacherId: [schedule?.teacherId || '', Validators.required],
      location: [schedule?.location || '', Validators.required],
      startTime: [schedule?.startTime || '', Validators.required],
      endTime: [schedule?.endTime || '', Validators.required],
      term: [schedule?.term || 'Fall', Validators.required],
      year: [schedule?.year || new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
      notes: [schedule?.notes || ''],

      // FIX: The custom validator is passed here
      days: this.fb.array(this.allDays.map(day =>
        this.fb.control(initialDays.includes(day))
      ), this.validateDaysSelected as ValidatorFn) // <-- Explicit casting ensures type compatibility
    });

    this.loading = false;
  }

  // Getter for the FormArray of days controls
  get daysFormArray(): FormArray {
    return this.scheduleForm.get('days') as FormArray;
  }

  /**
   * Custom validator to ensure at least one day is selected.
   * FIX: Argument is now typed as AbstractControl.
   */
  validateDaysSelected(control: AbstractControl): { daysRequired: boolean } | null {
    // Safely cast the AbstractControl to FormArray internally
    const formArray = control as FormArray;
    const hasSelectedDay = formArray.controls.some(control => control.value === true);
    return hasSelectedDay ? null : { daysRequired: true };
  }

  /**
   * Loads the lists of available classes and teachers.
   * In a real app, this would use forkJoin on your services.
   */
  loadReferenceData(): void {
    this.loading = true;
    this.errorMessage = null;

    // --- MOCK REFERENCE DATA LOAD ---
    // (Keep the mock data for now, replace with forkJoin later when services are injected)
    const mockClasses: ClassReference[] = [{ id: 'c1', name: 'Calculus I' }, { id: 'c2', name: 'Web Development' }];
    const mockTeachers: TeacherReference[] = [{ id: 't1', name: 'Dr. Evans' }, { id: 't2', name: 'Ms. Carter' }];

    this.availableClasses = mockClasses;
    this.availableTeachers = mockTeachers;

    // After loading reference data, load schedule data if in edit mode
    if (this.isEditMode && this.scheduleId) {
      this.loadScheduleData(this.scheduleId);
    } else {
      // If adding new, initialize form immediately
      this.initForm();
    }
  }

  /**
   * Loads existing schedule data when in edit mode.
   * @param id The ID of the schedule to load.
   */
  loadScheduleData(id: string): void {
    this.scheduleService.getSchedule(id)
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading schedule:', error);
          this.errorMessage = 'Failed to load schedule data.';
          return of(null);
        })
      )
      .subscribe((schedule: Schedule | null) => {
        if (schedule) {
          this.initForm(schedule);
        } else {
          this.router.navigate(['/schedules']);
        }
      });
  }

  /**
   * Handles form submission: either creation or update.
   */
  onSubmit(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const rawFormValue = this.scheduleForm.getRawValue();

    // Map boolean array back to array of DayOfWeek strings
    const selectedDays: DayOfWeek[] = rawFormValue.days
        .map((checked: boolean, index: number) => checked ? this.allDays[index] : null)
        .filter((day: DayOfWeek | null): day is DayOfWeek => day !== null);

    // Get denormalized names
    const className = this.availableClasses.find(c => c.id === rawFormValue.classId)?.name;
    const teacherName = this.availableTeachers.find(t => t.id === rawFormValue.teacherId)?.name;


    // Construct the data payload for the API
    const scheduleData: Schedule = {
        id: this.scheduleId,
        ...rawFormValue,
        days: selectedDays,
        className: className,
        teacherName: teacherName,
    };

    // Explicitly delete the internal boolean array if it exists on the final object structure
    delete (scheduleData as any).days;
    (scheduleData as any).days = selectedDays; // Re-add the string array

    let saveOperation: Observable<Schedule>;

    if (this.isEditMode && this.scheduleId) {
      saveOperation = this.scheduleService.updateSchedule(this.scheduleId, scheduleData);
    } else {
      saveOperation = this.scheduleService.createSchedule(scheduleData);
    }

    saveOperation
      .pipe(
        finalize(() => this.submitting = false),
        catchError(error => {
          console.error('Save failed:', error);
          this.errorMessage = `Failed to ${this.isEditMode ? 'update' : 'create'} schedule. API error.`;
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result) {
          console.log('Schedule saved successfully:', result);
          this.router.navigate(['/schedules']);
        }
      });
  }

  /**
   * Navigates back to the schedule list.
   */
  cancel(): void {
    this.router.navigate(['/schedules']);
  }
}
