import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // <-- 1. IMPORT AuthService

interface MenuItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  // 2. INJECT AuthService in the constructor
  constructor(private authService: AuthService) { }

  menuItems: MenuItem[] = [
    // Dashboard is the default entry point for the secure area
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },

    // Updated links reflect the nested routing structure
    { label: 'Students', icon: 'person', link: '/dashboard/students' },
    { label: 'Courses', icon: 'book', link: '/dashboard/courses' },
    { label: 'Grade Report', icon: 'assessment', link: '/dashboard/grades' },
    { label: 'My Profile', icon: 'account_circle', link: '/dashboard/profile' },

    // Assuming /settings will also be a protected route
    { label: 'Settings', icon: 'settings', link: '/dashboard/settings' },
  ];

  // 3. IMPLEMENT the logout method used in sidebar.component.html
  logout(): void {
    this.authService.logout();
  }
}
