import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, // FIX: Ensure FormBuilder is imported
  FormGroup,   // FIX: Ensure FormGroup is imported
  Validators,  // FIX: Ensure Validators are imported
  ReactiveFormsModule // For standalone component imports
} from '@angular/forms';
import { catchError, of } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { LoginCredentials } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Property to hold the login form (TS error resolved by importing FormGroup)
  loginForm!: FormGroup; // Use definite assignment assertion '!'

  errorMessage: string | null = null;
  submitting: boolean = false;

  constructor(
    // CRITICAL: Inject all services and FormBuilder explicitly for standalone components
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if the user is already logged in and redirect if necessary
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.initializeForm();
  }

  /**
   * Initializes the login form controls and validators.
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      // Assuming 'username' is used for login, as per user.model.ts
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Handles the submission of the login form.
   */
  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.submitting = true;

    const credentials: LoginCredentials = this.loginForm.value;

    this.authService.login(credentials)
      .pipe(
        catchError(error => {
          console.error('Login Error:', error);
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
          return of(null);
        })
      )
      .subscribe(response => {
        this.submitting = false;

        if (response) {
          // Navigate to the user's dashboard after successful login
          this.router.navigate(['/dashboard']);
        }
        // Error is handled in catchError
      });
  }

  // Getter to easily access form controls in the template for validation feedback
  get f() {
    return this.loginForm.controls;
  }
}
