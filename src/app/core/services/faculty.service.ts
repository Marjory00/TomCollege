// src/app/core/services/faculty.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// FIX 1: Corrected the path to navigate up one level (../) to reach the models directory.
import { FacultyMember } from '../models/faculty.model';
// FIX 2: Removed the redundant/circular import of FacultyService.

// Mock Data
const MOCK_FACULTY: FacultyMember[] = [
  {
    id: 101,
    name: 'Dr. Evelyn Reed',
    title: 'Professor and Department Chair',
    department: 'Computer Science',
    email: 'e.reed@tomcollege.edu',
    office: 'CSB 305',
    researchInterests: ['AI Ethics', 'Machine Learning', 'Data Privacy']
  },
  {
    id: 102,
    name: 'Prof. David Chen',
    title: 'Associate Professor',
    department: 'Engineering',
    email: 'd.chen@tomcollege.edu',
    office: 'ENGR 112',
    researchInterests: ['Robotics', 'Control Systems', 'Materials Science']
  },
  {
    id: 103,
    name: 'Ms. Sarah Jones',
    title: 'Lecturer',
    department: 'Humanities',
    email: 's.jones@tomcollege.edu',
    office: 'HMB 201',
    researchInterests: ['Modern Literature', 'Post-colonial Studies']
  }
];

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  constructor() { }

  /** Fetches all faculty members */
  getFacultyDirectory(): Observable<FacultyMember[]> {
    return of(MOCK_FACULTY);
  }
}
