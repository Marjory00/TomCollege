import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for two-way data binding [(ngModel)]
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule // Import FormsModule for template-driven forms
  ],
  template: `
    <div class="login-box">
      <h2>TomCollege Login</h2>
      <p class="subtitle">Access your Student or Faculty Dashboard</p>

      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            [(ngModel)]="username"
            required
            placeholder="e.g., admin">
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            [(ngModel)]="password"
            required
            placeholder="e.g., password">
        </div>

        <p *ngIf="loginError" class="error-message">
          Invalid username or password. Please try again.
        </p>

        <button type="submit" class="btn-login">Log In</button>
      </form>

      <a routerLink="/admissions" class="forgot-link">Forgot Password or Need Help?</a>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loginError = false;

  constructor(private authService: AuthService) { }

  onSubmit(): void {
    this.loginError = false;
    const success = this.authService.login(this.username, this.password);

    if (!success) {
      this.loginError = true;
    }
    // Note: If successful, the authService handles navigation to /dashboard.
  }
}
