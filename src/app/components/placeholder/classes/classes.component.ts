
// src/app/components/placeholder/classes/classes.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <h2 class="page-title"><i class="fas fa-book me-3"></i>Classes and Courses</h2>
      <div class="alert alert-info">
        This section manages course enrollment, class details, and curriculum mapping.
      </div>
    </div>
  `,
  styles: ['.page-title { font-weight: 300; }']
})
export class ClassesComponent { }
