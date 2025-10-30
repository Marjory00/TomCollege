// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from "@angular/router"; // ⬅️ FIX 1: Import Router
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';
import { Subscription } from 'rxjs'; // For managing the subscription

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ]
})
export class AppComponent implements OnInit {
  title = 'TomCollege School Management System';
  isLoggedIn: boolean = false;
  currentUser: User | null = null;
  private userSubscription!: Subscription; // To manage cleanup

  // ⬅️ FIX 2: Inject Router for navigation/redirection
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the BehaviorSubject in AuthService to reactively update the UI
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user; // true if user object exists, false otherwise
    });
  }

  /**
   * Checks if the current user has any of the required roles.
   * Delegates the check to AuthService.
   */
  hasRole(roles: string[]): boolean {
    return this.authService.hasRole(roles);
  }

  /**
   * Calls the AuthService logout method to clear tokens and redirect.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Programmatically navigate after logout
  }

  ngOnDestroy(): void {
    // Cleanup the subscription when the component is destroyed
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
