// src/app/components/classes/classes.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ⬅️ NEW: Required for *ngIf, *ngFor
import { RouterLink } from '@angular/router'; // ⬅️ NEW: Required for links (e.g., Edit/Add button)
import { ClassService } from '../../services/class.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],

    // ⬅️ FIX 1: Component must be marked as standalone
    standalone: true,

    // ⬅️ FIX 2: Explicitly import necessary modules and directives
    imports: [CommonModule, RouterLink],

    // ⬅️ FIX 3: Add services to the providers array for injection (if not provided in root)
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
   * Only Admin should typically delete classes.
   */
  canDelete(): boolean {
    return this.currentUser && this.currentUser.role === 'admin';
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
