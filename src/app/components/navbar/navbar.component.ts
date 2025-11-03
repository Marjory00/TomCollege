// src/app/features/navbar/navbar.component.ts

import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
// FIX: Import both RouterLink AND RouterLinkActive
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  // FIX: Add RouterLinkActive to the imports array
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {
  collegeName = 'TomCollege Dashboard';
  notificationsOpen: boolean = false;

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    console.log('Notifications toggled:', this.notificationsOpen);
  }
}
