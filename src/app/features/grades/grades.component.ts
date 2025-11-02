import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { TableComponent } from '../../components/table/table.component';

interface GradeReport {
  courseCode: string;
  courseTitle: string;
  instructor: string;
  grade: string;
  status: 'Complete' | 'In Progress';
}

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div class="grades-page">
      <h2>📈 Academic Grade Report</h2>
      <p>View your history and current course performance.</p>

      <div class="gpa-summary">
        <h3>Current GPA: {{ (gpa$ | async) || '...' }}</h3>
      </div>

      <app-table
        [data]="grades$ | async"
        [columns]="['Course Code', 'Course Title', 'Instructor', 'Grade', 'Status']"
        [keyMap]="['courseCode', 'courseTitle', 'instructor', 'grade', 'status']">
      </app-table>
    </div>
  `,
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  grades$: Observable<GradeReport[]> | undefined;
  gpa$: Observable<number> | undefined;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.grades$ = this.apiService.getGrades();
    this.gpa$ = this.apiService.getCurrentGPA();
  }
}
