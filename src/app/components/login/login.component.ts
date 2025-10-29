// src/app/components/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; // Added RouterLink for template use
// 🚨 FIX: Import ReactiveFormsModule (for formGroup) and CommonModule (for *ngIf)
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

  // ⬅️ FIX 1: Component must be marked as standalone
  standalone: true,

  // ⬅️ FIX 2: Explicitly import all necessary modules
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to dashboard if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
    // Get return URL from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Helper getter to easily access form controls in the template.
   * This is the fix for the 'f is undefined' error in the HTML.
   */
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Call login service
    this.authService.login(this.loginForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // Login successful, navigate
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          // Handle login error
          this.error = error.error?.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
  }
}
