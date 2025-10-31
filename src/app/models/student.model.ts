// Define the allowed types for enrollment status
export type EnrollmentStatus = 'Enrolled' | 'Graduated' | 'On Leave' | 'Suspended';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  // Use the defined type alias here
  enrollmentStatus: EnrollmentStatus;
  // Add other properties as needed
}
