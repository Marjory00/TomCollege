// src/app/features/courses/courses.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// Import necessary services and component
import { ApiService } from '../../core/services/api.service';
import { TableComponent } from '../../components/table/table.component';

// Define a simple interface for the course model
export interface Course {
  code: string;
  title: string;
  credits: number;
  department: string;
}

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

  courses$!: Observable<Course[]>;

  courseColumns: CourseTableColumn[] = [
    { key: 'code', header: 'Course Code' },
    { key: 'title', header: 'Title' },
    { key: 'credits', header: 'Credits' },
    { key: 'department', header: 'Department' }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.courses$ = this.apiService.getCourses() as Observable<Course[]>;
  }

  // FIX: Added the missing method definition
  addNewCourse(): void {
    // This is where you would implement logic to open a modal or navigate to a creation form
    console.log('Action: Adding a new course...');
    alert('Placeholder: New Course Form/Modal will open here.');
  }
}
