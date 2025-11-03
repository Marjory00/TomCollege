import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Note: Assuming GradeReport interface is also in its own model file in a real app.
interface GradeReport {
    courseCode: string;
    courseTitle: string;
    instructor: string;
    grade: string;
    status: 'Complete' | 'In Progress';
}

const MOCK_GRADES: GradeReport[] = [
    { courseCode: 'CS101', courseTitle: 'Intro to Programming', instructor: 'Dr. Smith', grade: 'A-', status: 'Complete' },
    { courseCode: 'MA205', courseTitle: 'Differential Calculus', instructor: 'Prof. Lee', grade: 'B+', status: 'Complete' },
    { courseCode: 'PH301', courseTitle: 'Quantum Mechanics', instructor: 'Dr. Nyerges', grade: 'A', status: 'Complete' },
    { courseCode: 'EN402', courseTitle: 'Advanced Writing', instructor: 'Prof. Patel', grade: 'IP', status: 'In Progress' }
];

@Injectable({
  providedIn: 'root'
})
export class GradesService {

  constructor() { }

  getGrades(): Observable<GradeReport[]> {
    return of(MOCK_GRADES);
  }

  getCurrentGPA(): Observable<number> {
    // Mocking a GPA calculation
    return of(3.85);
  }
}
