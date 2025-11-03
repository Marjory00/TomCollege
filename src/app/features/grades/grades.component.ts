// src/app/features/grades/grades.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// FIX: Corrected path to the singular 'core' folder.
// Path: features/grades/ -> features/ -> app/core/services/
import { GradesService } from '../../core/services/grades.service';

// Corrected path for TableComponent (up two levels to 'app/components/table')
import { TableComponent } from '../../components/table/table.component';

// Define interfaces for strong typing
interface GradeReport {
    courseCode: string;
    courseTitle: string;
    instructor: string;
    grade: string;
    status: 'Complete' | 'In Progress';
}

interface GradeTableColumn {
    key: keyof GradeReport;
    header: string;
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
        <h3>Current GPA: {{ (gpa$ | async) || 'N/A' }}</h3>
      </div>

      <app-table
        [data]="grades$ | async"
        [columns]="gradeColumns">
      </app-table>
    </div>
  `,
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  grades$: Observable<GradeReport[]> | undefined;
  gpa$: Observable<number> | undefined;

  gradeColumns: GradeTableColumn[] = [
    { key: 'courseCode', header: 'Course Code' },
    { key: 'courseTitle', header: 'Course Title' },
    { key: 'instructor', header: 'Instructor' },
    { key: 'grade', header: 'Grade' },
    { key: 'status', header: 'Status' }
  ];

  constructor(private gradesService: GradesService) { }

  ngOnInit(): void {
    this.grades$ = this.gradesService.getGrades();
    this.gpa$ = this.gradesService.getCurrentGPA();
  }
}
