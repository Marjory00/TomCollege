// src/app/components/teachers/teacher-list/teacher-list.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, switchMap, catchError, of, finalize } from 'rxjs';

import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/teacher.model';
import { ApiResponse } from '../../../models/api-response.model';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {

  currentUser: User | null = null;

  teachers: Teacher[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  errorMessage: string | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  searchTerm: string = '';

  private refreshTeachers$ = new BehaviorSubject<void>(undefined);

  constructor(
    @Inject(TeacherService) private teacherService: TeacherService,
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    // Use switchMap to handle pagination/search refreshes
    this.refreshTeachers$.pipe(
      switchMap(() => this.getTeachers()),
      catchError(error => {
        this.errorMessage = 'Failed to load teacher data.';
        console.error('Error fetching teachers:', error);
        return of(null);
      })
    )
    .subscribe((response: ApiResponse<Teacher> | null) => {
      this.loading = false;
      if (response) {
        this.teachers = response.data;
        this.totalRecords = response.total;
      } else {
        this.teachers = [];
        this.totalRecords = 0;
      }
    });

    this.loadTeachers();
  }

  private getTeachers(): Observable<ApiResponse<Teacher>> {
    this.loading = true;
    this.errorMessage = null;

    const query = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchTerm
    };

    return this.teacherService.getTeachers(query).pipe(
      finalize(() => this.loading = false)
    );
  }

  loadTeachers(): void {
    this.refreshTeachers$.next();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadTeachers();
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTeachers();
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
