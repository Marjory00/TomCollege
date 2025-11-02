import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngFor
import { RouterModule } from '@angular/router'; // Required for routerLink and routerLinkActive

// Define the structure for sidebar items
interface MenuItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true, // Declare as standalone
  imports: [CommonModule, RouterModule], // Import dependencies
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Array of menu items to generate the navigation links
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    { label: 'Students', icon: 'person', link: '/students' },
    { label: 'Courses', icon: 'book', link: '/courses' },
    { label: 'Settings', icon: 'settings', link: '/settings' },
  ];
}
