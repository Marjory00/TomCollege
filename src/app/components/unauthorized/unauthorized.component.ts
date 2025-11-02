
// src/app/components/unauthorized/unauthorized.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert alert-warning my-5">
      <h3>🚫 Unauthorized Access / Placeholder</h3>
      <p>You do not have the required permissions to view this page, or this is a temporary placeholder for the login screen.</p>
    </div>
  `,
  styles: []
})
export class UnauthorizedComponent {}
