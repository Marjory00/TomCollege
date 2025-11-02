import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for the async pipe
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { TableComponent } from '../../components/table/table.component'; // Import the standalone table

@Component({
  selector: 'app-courses',
  standalone: true, // Mark component as standalone
  imports: [
    CommonModule,
    TableComponent // Must import any component used in its template
  ],
  template: `
    <div class="courses-page">
      <h2>📚 Course Catalog</h2>
      <p>List of all active courses offered by the college.</p>

      <app-table
        [data]="courses$ | async"
        [columns]="['Code', 'Title', 'Credits', 'Department']"
        [keyMap]="['code', 'title', 'credits', 'department']">
      </app-table>
    </div>
  `,
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  // Observable to hold the list of courses retrieved from the API
  courses$: Observable<Course[]>;

  constructor(private apiService: ApiService) {
    // Inject the ApiService
    this.courses$ = this.apiService.getCourses();
  }

  ngOnInit(): void {
    // Initialization logic here
  }
}
