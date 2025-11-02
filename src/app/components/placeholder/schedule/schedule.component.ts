// src/app/components/placeholder/schedule/schedule.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <h2 class="page-title"><i class="fas fa-calendar-alt me-3"></i>My Schedule</h2>
      <div class="alert alert-info">
        Schedule management features will be implemented here. This view shows class timings, meetings, and obligations.
      </div>
    </div>
  `,
  styles: ['.page-title { font-weight: 300; }']
})
export class ScheduleComponent { }
