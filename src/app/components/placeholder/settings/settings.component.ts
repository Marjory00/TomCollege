
// src/app/components/placeholder/settings/settings.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <h2 class="page-title"><i class="fas fa-cog me-3"></i>System Settings</h2>
      <div class="alert alert-info">
        Admin-level configurations for the system will be placed here.
      </div>
    </div>
  `,
  styles: ['.page-title { font-weight: 300; }']
})
export class SettingsComponent { }
