import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// Import the necessary components and services
import { ApiService } from '../../core/services/api.service';
import { Student } from '../../models/student.model';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, TableComponent], // Ensure TableComponent is imported
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  // Observable to hold the list of students
  students$!: Observable<Student[]>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Fetch the students data from the API service
    this.students$ = this.apiService.getStudents();
  }
}
