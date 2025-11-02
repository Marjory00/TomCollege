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
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TomCollege';

  // Controls the visibility of the Sidebar, which defines the dashboard layout
  showDashboardLayout = false;

  // Updated to include all new public pages that should NOT have the Sidebar
  private publicRoutes: string[] = ['/', '/login', '/admissions', '/faculty', '/calendar', '/contact', '/privacy'];

  constructor(private router: Router) {
    // Watch router events to determine if we are on a secure/dashboard route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const currentUrl = (event as NavigationEnd).urlAfterRedirects;

      // The layout logic simplifies to: ONLY show the dashboard layout if the URL starts with '/dashboard'
      if (currentUrl.startsWith('/dashboard')) {
        this.showDashboardLayout = true;
      } else {
        // Hide the sidebar for all public, login, and simple root routes
        this.showDashboardLayout = false;
      }
    });
  }
}
