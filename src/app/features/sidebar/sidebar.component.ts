import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  link: string; // Updated to include '/dashboard' prefix
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // FIX: All secure links must now start with '/dashboard'
  menuItems: MenuItem[] = [
    // Dashboard is the default entry point for the secure area
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },

    // Updated links to reflect the nested routing structure
    { label: 'Students', icon: 'person', link: '/dashboard/students' },
    { label: 'Courses', icon: 'book', link: '/dashboard/courses' },
    { label: 'Grade Report', icon: 'assessment', link: '/dashboard/grades' },
    { label: 'My Profile', icon: 'account_circle', link: '/dashboard/profile' },

    // Assuming /settings will also be a protected route
    { label: 'Settings', icon: 'settings', link: '/dashboard/settings' },
  ];
}
