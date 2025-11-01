import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Needed for router-outlet and navigation
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model'; // Assuming User model path

@Component({
  selector: 'app-layout',
  standalone: true,
  // CRITICAL: We need RouterModule for the <router-outlet> and routerLink
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  // NOTE: You must ensure the correct path for the CSS file exists!
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  currentUser: User | null = null;

  // This state controls the sidebar visibility (for mobile or responsive design)
  isSidebarCollapsed: boolean = false;

  constructor(
    // FIX: Explicitly inject AuthService to resolve the 'No suitable injection token' error.
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the current user data from the service to display name/role
    this.currentUser = this.authService.currentUserValue;
  }

  /**
   * Toggles the collapsed state of the sidebar.
   */
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  /**
   * Logs the current user out and redirects to the login page.
   */
  logout(): void {
    this.authService.logout();
    // Redirect to login after logout
    this.router.navigate(['/login']);
  }

  /**
   * Checks if the current user has the specified role.
   * FIX: Ensures a boolean value is ALWAYS returned, resolving the 'void' error.
   */
  hasRole(requiredRole: string): boolean {
    return this.currentUser?.role === requiredRole;
  }
}
