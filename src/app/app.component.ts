// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common'; // Needed for *ngIf and *ngFor
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  // ⬅️ Updated to reference the external HTML template
  templateUrl: './app.component.html',
  // ⬅️ Updated to reference the external CSS stylesheet
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,       // Used for sidebar navigation links
    RouterLinkActive, // Used for highlighting active sidebar link
    CommonModule      // Used for structural directives (*ngIf)
  ]
})
export class AppComponent implements OnInit {
  title = 'TomCollege School Management System';
  isLoggedIn: boolean = false;
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to the BehaviorSubject in AuthService to reactively update the UI
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user; // true if user object exists, false otherwise
    });
  }

  /**
   * Checks if the current user has any of the required roles.
   * Used for conditional rendering in the sidebar (app.component.html).
   */
  hasRole(roles: string[]): boolean {
    return this.authService.hasRole(roles);
  }

  /**
   * Calls the AuthService logout method to clear tokens and redirect.
   */
  logout(): void {
    this.authService.logout();
  }
}
