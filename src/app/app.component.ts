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

  // Controls the visibility of the Sidebar and layout structure
  showDashboardLayout = false;

  // NOTE: The private publicRoutes array is now unnecessary as the logic below is simpler and more reliable.

  constructor(private router: Router) {
    // Watch router events to determine if we are on a secure/dashboard route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const currentUrl = (event as NavigationEnd).urlAfterRedirects;

      // The layout logic simplifies to checking the route prefix:
      // showDashboardLayout is true ONLY if the URL starts with '/dashboard'
      this.showDashboardLayout = currentUrl.startsWith('/dashboard');
    });
  }
}
