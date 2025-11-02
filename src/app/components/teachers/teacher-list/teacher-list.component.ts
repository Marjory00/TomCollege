// src/app/components/teachers/teacher-list/teacher-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../services/teacher.service';
import { Observable, of } from 'rxjs';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Teacher List (Mock)</h2>
    <p>This component successfully called the service's <code>getAllTeachers</code> method.</p>
    <p class="text-success">Compilation successful!</p>
    @if (teachers$ | async; as teachers) {
      @if (teachers.data.length > 0) {
        <ul>
          @for (teacher of teachers.data; track teacher.id) {
            <li>{{ teacher.firstName }} {{ teacher.lastName }} - {{ teacher.department }}</li>
          }
        </ul>
      } @else {
        <p class="text-muted">No teachers found.</p>
      }
    }
  `,
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  // Using 'any' here as the service stub returns 'any'
  teachers$: Observable<any> = of({ data: [], total: 0 });
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(query: string = ''): void {
    this.loading = true;
    this.errorMessage = null;

    // FIX: Changed 'getTeachers' to 'getAllTeachers'
    this.teachers$ = this.teacherService.getAllTeachers(query);
    this.loading = false;
  }
}
