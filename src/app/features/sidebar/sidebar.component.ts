// src/app/features/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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

  constructor(private authService: AuthService) { }

  menuItems: MenuItem[] = [
    // Dashboard is the default entry point for the secure area
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },

    // Corrected nested links (e.g., /dashboard/students)
    { label: 'Students', icon: 'person', link: '/dashboard/students' },
    { label: 'Courses', icon: 'book', link: '/dashboard/courses' },
    { label: 'Grade Report', icon: 'assessment', link: '/dashboard/grades' },
    { label: 'My Profile', icon: 'account_circle', link: '/dashboard/profile' },

    // Assuming /settings will also be a protected route
    { label: 'Settings', icon: 'settings', link: '/dashboard/settings' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
