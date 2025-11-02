import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for the async pipe and directives
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { Student } from '../../models/student.model';
import { TableComponent } from '../../components/table/table.component'; // Import the standalone table

@Component({
  selector: 'app-students',
  standalone: true, // Mark component as standalone
  imports: [
    CommonModule,
    TableComponent // Must import any component used in its template
  ],
  template: `
    <div class="students-page">
      <h2>🧑‍🎓 Student Management</h2>
      <p>View and manage all registered students.</p>

      <app-table
        [data]="students$ | async"
        [columns]="['ID', 'Name', 'Major', 'GPA']"
        [keyMap]="['id', 'name', 'major', 'gpa']">
      </app-table>
    </div>
  `,
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  // Observable to hold the list of students retrieved from the API
  students$: Observable<Student[]>;

  constructor(private apiService: ApiService) {
    // Inject the ApiService, which is provided globally in app.config.ts
    this.students$ = this.apiService.getStudents();
  }

  ngOnInit(): void {
    // Initialization logic here
  }
}
