// src/app/components/students/student-list/student-list.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Required for [(ngModel)]
import { Observable, BehaviorSubject, switchMap, catchError, of, finalize } from 'rxjs';

import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';
import { ApiResponse } from '../../../models/api-response.model';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  // IMPORT FormsModule for [(ngModel)] to work
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  // Properties required by the HTML template:
  currentUser: User | null = null;
  students: Student[] = [];
  totalRecords: number = 0; // Renamed from totalStudents for consistency
  loading: boolean = true;
  errorMessage: string | null = null;

  // Pagination and Search properties
  currentPage: number = 1;
  pageSize: number = 10;
  searchTerm: string = ''; // <-- Binds to the search input via [(ngModel)]

  private refreshStudents$ = new BehaviorSubject<void>(undefined);

  constructor(
    @Inject(StudentService) private studentService: StudentService,
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    // Set up reactive stream to load data when pagination/search changes
    this.refreshStudents$.pipe(
      switchMap(() => this.fetchStudents()),
      catchError(error => {
        this.errorMessage = 'Failed to load student data.';
        console.error('Error fetching students:', error);
        return of(null);
      })
    )
    .subscribe((response: ApiResponse<Student> | null) => {
      this.loading = false;
      if (response) {
        this.students = response.data;
        this.totalRecords = response.total;
      } else {
        this.students = [];
        this.totalRecords = 0;
      }
    });

    this.loadStudents();
  }

  private fetchStudents(): Observable<ApiResponse<Student>> {
    this.loading = true;
    this.errorMessage = null;

    const query = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchTerm
    };

    // Assuming studentService.getStudents takes a query object for pagination/search
    return this.studentService.getStudents(query).pipe(
      finalize(() => this.loading = false)
    );
  }

  // Method to trigger data refresh
  loadStudents(): void {
    this.refreshStudents$.next();
  }

  // Method called when search term changes via (ngModelChange) or button click
  onSearchChange(): void {
    this.currentPage = 1; // Always reset to the first page on a new search
    this.loadStudents();
  }

  // Method called when pagination buttons are clicked
  onPageChange(page: number): void {
    // You might want to add a guard here, but the HTML handles most of it
    this.currentPage = page;
    this.loadStudents();
  }

  // Method to determine the CSS class for the status badge
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-success';
      case 'Suspended':
        return 'bg-danger';
      case 'On Probation':
        return 'bg-warning text-dark';
      case 'Graduated':
        return 'bg-info';
      case 'Withdrawn':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  }

  // Method to handle student deletion
  deleteStudent(id: string): void {
    if (confirm(`Are you sure you want to delete student ID: ${id}?`)) {
      // Show loading state again if desired, or handle via toast/notification
      this.studentService.deleteStudent(id)
        .pipe(
          catchError(error => {
            alert('Failed to delete student.');
            console.error('Delete error:', error);
            return of(undefined);
          })
        )
        .subscribe(result => {
          if (result) {
            // Success, reload the list to reflect the change
            this.loadStudents();
          }
        });
    }
  }
}
