import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="public-page admissions-page">
      <h2>Admissions Information</h2>
      <p>Your journey starts here. Review our requirements and deadlines.</p>
      <ul>
        <li>Application Deadline: November 1st</li>
        <li>Required Documents: Transcripts, Essays, Recommendations</li>
        <li>Contact: admissions@tomcollege.edu</li>
      </ul>
      <button class="btn-primary">View Application Status</button>
    </div>
  `,
  styleUrls: ['./admissions.component.css']
})
export class AdmissionsComponent { }
