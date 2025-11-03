// src/app/features/settings/settings.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule added for potential form inputs
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  notificationsEnabled: boolean = true;
  theme: string = 'light';
  currentPassword: string = '';
  newPassword: string = '';

  saveSettings(): void {
    console.log('Settings saved:', {
      notificationsEnabled: this.notificationsEnabled,
      theme: this.theme
    });
    // Add logic to call a service to persist settings
  }

  updatePassword(): void {
    if (this.newPassword.length >= 8) {
      console.log('Password updated.');
      // Add logic to call authentication service to update password
      this.currentPassword = '';
      this.newPassword = '';
    } else {
      alert('New password must be at least 8 characters long.');
    }
  }
}
