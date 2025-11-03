// src/app/features/students/students.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Corrected import paths
import { StudentsService } from '../../core/services/students.service';
import { Student } from '../../core/models/student.model';

// Column interface for type-safe table rendering
interface StudentTableColumn {
  key: keyof Student;
  header: string;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students$!: Observable<Student[]>;
  loading = true;
  error: string | null = null;

  tableColumns: StudentTableColumn[] = [
    { key: 'id', header: 'ID' },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'major', header: 'Major' },
    { key: 'enrollmentDate', header: 'Enrollment Date' },
    { key: 'status', header: 'Status' }
  ];

  // Modern Angular DI using inject()
  private readonly studentsService = inject(StudentsService);

  ngOnInit(): void {
    this.students$ = this.studentsService.getStudents().pipe(
      tap(() => this.loading = false),
      catchError(err => {
        this.error = 'Failed to load students';
        this.loading = false;
        return of([]);
      })
    );
  }
}
