// src/app/components/classes/classes.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClassService } from '../../services/class.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],

    // ✅ Correctly marked as standalone
    standalone: true,

    // ✅ Correctly imports necessary directives
    imports: [CommonModule, RouterLink],

    // ✅ Correctly provides the local service (if not provided in root)
    providers: [ClassService]
})
export class ClassesComponent implements OnInit {
  classes: any[] = [];
  loading = true;
  currentUser: any;

  constructor(
    private classService: ClassService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Retrieves the current user for role-based access control
    this.currentUser = this.authService.currentUserValue;
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    this.classService.getAllClasses().subscribe({
      next: (response) => {
        this.classes = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Helper function to check if the user is authorized to delete.
   */
  canDelete(): boolean {
    // Uses hasRole from AuthService for robust checking (better than direct property access)
    return this.authService.hasRole(['admin']);
  }

  deleteClass(id: string): void {
    if (!this.canDelete()) {
        alert('You do not have permission to delete classes.');
        return;
    }

    if (confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      this.classService.deleteClass(id).subscribe({
        next: () => {
          this.loadClasses();
          alert('Class deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting class:', error);
          alert('Failed to delete class. Check server logs.');
        }
      });
    }
  }
}
