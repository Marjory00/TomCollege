import { Component, OnInit, OnDestroy, Inject } from '@angular/core'; // Added OnDestroy and Inject
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
// import { HttpClientModule } from '@angular/common/http'; // CRITICAL FIX 1: Removed

// Assuming these models and services exist in relative paths
import { User } from './models/user.model'; // FIX 2: Assuming correct relative path
import { AuthService } from './services/auth.service'; // FIX 2: Assuming correct relative path

@Component({
  selector: 'app-root',
  standalone: true,
  // CRITICAL FIX 1: Removed HttpClientModule
  imports: [CommonModule, RouterModule],
  template: '<router-outlet></router-outlet>', // Using a simple template as the root usually just hosts the router
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy { // Added OnDestroy interface

  currentUser: User | null = null;
  private userSubscription!: Subscription;

  constructor(
    // CRITICAL FIX 3: Use @Inject for robust dependency injection
    @Inject(AuthService) private authService: AuthService,
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
   * NOTE: This function is typically only needed if AppComponent had a complex template,
   * but it's retained here for completeness if logic is moved here later.
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
   * NOTE: This is generally handled in the LayoutComponent, not AppComponent.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
