import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Import the standalone layout components
import { NavbarComponent } from './features/navbar/navbar.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { FooterComponent } from './public/footer/footer.component'; // <-- FIX: Added FooterComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    FooterComponent // <-- FIX: Added Footer to imports
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TomCollege';
  showDashboardLayout = false;

  // FIX: Updated to include the new public pages (/calendar, /contact)
  private publicRoutes: string[] = ['/', '/login', '/admissions', '/faculty', '/calendar', '/contact', '/privacy'];

  constructor(private router: Router) {
    // Watch router events to determine if we are on a secure/dashboard route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const currentUrl = (event as NavigationEnd).urlAfterRedirects;

      // Check for exact match with simple public routes (e.g., '/', '/login')
      const isPublicRoute = this.publicRoutes.some(route => currentUrl === route);

      // Determine the layout state
      if (currentUrl.startsWith('/dashboard')) {
        // Show dashboard layout for /dashboard and all its children
        this.showDashboardLayout = true;
      } else if (isPublicRoute) {
        // Hide dashboard layout for specific public pages
        this.showDashboardLayout = false;
      } else {
         // This covers the catch-all wildcard or any public route we missed
         // Also useful for public pages with parameters (though not used here)
         this.showDashboardLayout = false;
      }
    });
  }
}
