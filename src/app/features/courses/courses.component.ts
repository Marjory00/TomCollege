// src/app/features/courses/courses.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// Import necessary services and component
import { ApiService } from '../../core/services/api.service';
import { TableComponent } from '../../components/table/table.component';

// Define a simple interface for the course model
interface Course {
  code: string;
  title: string;
  credits: number;
  department: string;
}

// FIX 1: Define a strongly-typed interface for the table columns
interface CourseTableColumn {
    key: keyof Course;
    header: string;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  // Observable to hold the list of courses
  courses$!: Observable<Course[]>;

  // FIX 2: Add the required columns property for the <app-table> component
  courseColumns: CourseTableColumn[] = [
    { key: 'code', header: 'Course Code' },
    { key: 'title', header: 'Title' },
    { key: 'credits', header: 'Credits' },
    { key: 'department', header: 'Department' }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Fetch the courses data from the API service
    this.courses$ = this.apiService.getCourses();
  }
}
