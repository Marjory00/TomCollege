
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faculty',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="public-page faculty-page">
      <h2>Faculty Directory</h2>
      <p>Meet our distinguished professors and researchers.</p>

      <ul class="faculty-list">
        <li>Dr. Jane Smith - Computer Science</li>
        <li>Prof. Alex Chen - History</li>
        <li>Dr. Robert Jones - Physics</li>
      </ul>
    </div>
  `,
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent { }
