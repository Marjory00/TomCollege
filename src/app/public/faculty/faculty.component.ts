// src/app/public/faculty/faculty.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🟢 FIX: Required for [(ngModel)] (search box)
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Although 'map' isn't explicitly used in this simplified version, it's often imported.

import { FacultyMember } from '../../core/models/faculty.model'; // 🟢 FIX: Import data model
import { FacultyService } from '../../core/services/faculty.service'; // 🟢 FIX: Import service

@Component({
  selector: 'app-faculty',
  standalone: true,
  // 🟢 FIX: Added FormsModule to the imports array
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty.component.html', // 🟢 FIX: Use external template
  styleUrls: ['./faculty.component.css'] // 🟢 FIX: Use external styles
})
export class FacultyComponent implements OnInit {

  faculty$!: Observable<FacultyMember[]>; // Observable for the template (async pipe)
  allFaculty: FacultyMember[] = [];     // Array to hold all original data
  searchTerm: string = '';              // Model for the search input

  constructor(private facultyService: FacultyService) { }

  ngOnInit(): void {
    // Fetch data and populate both lists
    this.facultyService.getFacultyDirectory().subscribe(data => {
      this.allFaculty = data;
      // Initialize the main observable stream with all data
      this.faculty$ = new Observable(observer => observer.next(this.allFaculty));
    });
  }

  /** Filters the faculty list based on the search term */
  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (term === '') {
      // If search box is empty, show all faculty
      this.faculty$ = new Observable(observer => observer.next(this.allFaculty));
      return;
    }

    // Filter by name, department, or title
    const filtered = this.allFaculty.filter(member =>
      member.name.toLowerCase().includes(term) ||
      member.department.toLowerCase().includes(term) ||
      member.title.toLowerCase().includes(term)
    );

    this.faculty$ = new Observable(observer => observer.next(filtered));
  }
}
