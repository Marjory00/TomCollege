import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

// Assuming these models and services exist
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  // Add necessary modules for routing, directives, and services
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './app.component.html', // Links to the provided HTML
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Expose currentUser directly as the synchronous value (or Observable if using async pipe)
  currentUser: User | null = null;
  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the currentUser Observable from AuthService to keep the template updated
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Helper function used in the template to check if the user has one of the required roles.
   * NOTE: This function is called frequently; for high-performance apps, consider using pipes or properties.
   * @param roles An array of roles (e.g., ['admin', 'teacher']).
   * @returns boolean
   */
  hasRole(roles: string[]): boolean {
    const userRole = this.currentUser?.role;
    // Check if the user is logged in AND their role is included in the required roles list
    return !!userRole && roles.includes(userRole);
  }

  /**
   * Logs the user out and navigates to the login page.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
