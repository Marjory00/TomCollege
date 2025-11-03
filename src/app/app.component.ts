// src/app/app.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Import the standalone layout components
import { NavbarComponent } from './features/navbar/navbar.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { FooterComponent } from './public/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    // These components are conditionally displayed in the template
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TomCollege';

  // Controls the visibility of the Sidebar and dashboard-style Navbar
  showDashboardLayout = false;

  // FIX 1: Define the specific public, unauthenticated routes that require the simple layout.
  // These routes DO NOT get the sidebar/dashboard structure.
  private publicRoutes = ['', 'login', 'admissions', 'faculty'];

  constructor(private router: Router) {
    // Watch router events to determine if we are on a secure/dashboard route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects;

      // FIX 2: Check if the current URL (without leading slash and query params)
      // is one of the defined public routes. If it is, hide the dashboard layout.
      const pathSegment = currentUrl.split('/')[1].split('?')[0];

      // If the URL path segment (e.g., 'login', 'admissions') is in publicRoutes,
      // then showDashboardLayout is false (public layout). Otherwise, it's true (dashboard layout).
      this.showDashboardLayout = !this.publicRoutes.includes(pathSegment);
    });
  }
}
