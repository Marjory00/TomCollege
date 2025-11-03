// src/app/core/models/student.model.ts

/** Interface defining the structure of a Student object. */
export interface Student {
  /** Unique identifier for the student */
  id: number;

  /** Student's first name */
  firstName: string;

  /** Student's last name */
  lastName: string;

  /** Declared academic major */
  major: string;

  /** Enrollment date in ISO format (YYYY-MM-DD) */
  enrollmentDate: string;

  /** Current academic status */
  status: 'Active' | 'On Leave' | 'Graduated';
}
