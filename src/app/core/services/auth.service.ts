
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Use a simple boolean to track login status (should use Signals/Observables in production)
  private isLoggedIn = false;

  constructor(private router: Router) { }

  /**
   * Mock login function
   * @param username - The provided username
   * @param password - The provided password
   * @returns true if login is successful, false otherwise
   */
  login(username: string, password: string): boolean {
    // Mock validation: success for "admin" / "password"
    if (username === 'admin' && password === 'password') {
      this.isLoggedIn = true;
      // Navigate to the secure dashboard on success
      this.router.navigate(['/dashboard']);
      return true;
    } else {
      this.isLoggedIn = false;
      return false;
    }
  }

  logout(): void {
    this.isLoggedIn = false;
    // Navigate back to the public home page on logout
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
