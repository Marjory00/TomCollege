import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Needed for [routerLink]
import { Observable, of } from 'rxjs'; // For async data handling
// import { StudentService } from '../../services/student.service'; // Will be needed later
// import { User } from '../../models/user.model'; // Assuming students are represented by a User-like interface

@Component({
  selector: 'app-students',
  standalone: true,
  // CRITICAL: RouterModule needed for the 'Add Student' button routerLink
  imports: [CommonModule, RouterModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  // Replace 'any[]' with 'Observable<User[]>' or a specific Student model array
  students$: Observable<any[]> = of([]);
  loading = false;

  // constructor(private studentService: StudentService) {} // Inject StudentService when created

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    // Mock Data for now: replace with actual service call
    this.students$ = of([
      { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@school.com', role: 'student' },
      { id: 2, firstName: 'Bob', lastName: 'Johnson', email: 'bob@school.com', role: 'student' },
      { id: 3, firstName: 'Charlie', lastName: 'Brown', email: 'charlie@school.com', role: 'student' },
    ]);
    this.loading = false;

    // Example of real service usage (when created):
    /*
    this.students$ = this.studentService.getAllStudents().pipe(
      finalize(() => this.loading = false)
    );
    */
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student record?')) {
      console.log(`Deleting student with ID: ${id}`);
      // Add actual service call logic here
      this.loadStudents(); // Reload list after deletion
    }
  }
}
