import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Import the standalone layout components
import { NavbarComponent } from './features/navbar/navbar.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent // Used conditionally
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TomCollege';
  showDashboardLayout = false;

  // Define public routes that must NOT show the sidebar/navbar
  // NOTE: This includes the root path ('/') and all other dedicated public pages.
  private publicRoutes: string[] = ['/', '/login', '/admissions', '/faculty'];

  constructor(private router: Router) {
    // Watch router events to determine if we are on a secure/dashboard route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const currentUrl = (event as NavigationEnd).urlAfterRedirects;

      // Determine if the URL is a secure route
      // A route is secure if:
      // 1. It starts with '/dashboard'
      // AND
      // 2. It is NOT on the explicit list of simple public routes

      const isPublicRoute = this.publicRoutes.some(route => currentUrl === route);

      if (isPublicRoute) {
        // If the URL is '/', '/login', '/admissions', etc., hide the dashboard layout.
        this.showDashboardLayout = false;
      } else if (currentUrl.startsWith('/dashboard')) {
        // If the URL starts with '/dashboard', show the dashboard layout.
        this.showDashboardLayout = true;
      } else {
        // Default to public layout for anything else (e.g., error pages, which you can handle later)
        this.showDashboardLayout = false;
      }
    });
  }
}
