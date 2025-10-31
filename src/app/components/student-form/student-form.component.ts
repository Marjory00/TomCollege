import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // CRITICAL FIX: Import RouterModule

@Component({
  selector: 'app-student-form',
  standalone: true,
  // ADD RouterModule to the imports array
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  isEditMode: boolean = false;
  studentId: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if we are in edit mode
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.studentId;

    this.initForm();

    if (this.isEditMode) {
      // Logic to load student data for editing would go here
    }
  }

  private initForm(): void {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });
  }

  get f() { return this.studentForm.controls; }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      return;
    }

    this.loading = true;
    console.log('Form submitted:', this.studentForm.value);

    // After success, you would typically navigate back
    // this.router.navigate(['/students']);
    this.loading = false;
  }
}
