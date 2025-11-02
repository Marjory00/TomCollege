import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <-- FIX: Import RouterLink

@Component({
  selector: 'app-admissions',
  standalone: true,
  // FIX: Added RouterLink to imports
  imports: [CommonModule, RouterLink],
  // FIX: Replaced inline 'template' with 'templateUrl'
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.css']
})
export class AdmissionsComponent {
  // FIX: Re-adding the dynamic data needed for the HTML template
  deadlines = [
    { type: 'Early Action', date: 'November 15', status: 'Upcoming' },
    { type: 'Regular Decision', date: 'January 15', status: 'Deadline' },
    { type: 'Transfer', date: 'March 1', status: 'Open' }
  ];
}
