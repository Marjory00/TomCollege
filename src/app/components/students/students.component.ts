// src/app/components/students/students.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../models/student.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],

  // Providers necessary for this standalone component
  providers: [StudentService]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  loading = true;
  searchTerm: string = '';
  currentUser: any;

  // Constructor with dependency injection
  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAllStudents().subscribe({
      next: (response) => {
        this.students = response.data || [];
        this.filteredStudents = [...this.students];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredStudents = [...this.students];
      return;
    }

    // 🚨 FIX: Removed redundant optional chaining (`?.`) from userId access
    this.filteredStudents = this.students.filter(student =>
      student.userId.firstName.toLowerCase().includes(term) ||
      student.userId.lastName.toLowerCase().includes(term) ||
      student.studentId.toLowerCase().includes(term) ||
      student.grade.toLowerCase().includes(term)
    );
  }

  deleteStudent(id: string): void {
    if (!this.authService.hasRole(['admin'])) {
        alert('You do not have permission to delete students.');
        return;
    }

    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          alert('Student deleted successfully');
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('Failed to delete student');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
