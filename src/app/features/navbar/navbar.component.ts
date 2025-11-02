import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  // FIX APPLIED: Disable View Encapsulation to allow local CSS to affect all elements
  // and ensure proper alignment when dealing with fixed global layout styles.
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {
  collegeName = 'TomCollege Dashboard';
  // NEW: State to track if the notification dropdown is open
  notificationsOpen: boolean = false;

  /**
   * Toggles the visibility of the notification dropdown.
   * This method is called by the (click) event on the notification button in the HTML.
   */
  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    console.log('Notifications toggled:', this.notificationsOpen);

    // TODO: We will add logic here later to prevent document clicks from closing
    // if the user clicks inside the notification panel.
  }
}
