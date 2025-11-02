import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.css']
})
export class AdmissionsComponent {
  deadlines = [
    { type: 'Early Action', date: 'November 15', status: 'Upcoming' },
    { type: 'Regular Decision', date: 'January 15', status: 'Deadline' },
    { type: 'Transfer', date: 'March 1', status: 'Open' }
  ];
}
