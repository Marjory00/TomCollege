// src/app/components/students/student-list/student-list.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, switchMap, catchError, of, finalize } from 'rxjs';

import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';
import { ApiResponse } from '../../../models/api-response.model';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';


@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TitleCasePipe],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  currentUser: User | null = null;

  students: Student[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  errorMessage: string | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  searchTerm: string = '';

  private refreshStudents$ = new BehaviorSubject<void>(undefined);

  constructor(
    @Inject(StudentService) private studentService: StudentService,
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    this.refreshStudents$.pipe(
      switchMap(() => this.getStudents()),
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

  private getStudents(): Observable<ApiResponse<Student>> {
    this.loading = true;
    this.errorMessage = null;

    const query = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchTerm
    };

    return this.studentService.getStudents(query).pipe(
      finalize(() => this.loading = false)
    );
  }

  loadStudents(): void {
    this.refreshStudents$.next();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadStudents();
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadStudents();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  get pagesArray(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
