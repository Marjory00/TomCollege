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

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, TableComponent], // Ensure TableComponent is imported
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  // Observable to hold the list of courses
  courses$!: Observable<Course[]>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Fetch the courses data from the API service
    this.courses$ = this.apiService.getCourses();
  }
}
