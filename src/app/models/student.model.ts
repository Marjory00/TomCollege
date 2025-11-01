// src/app/models/student.model.ts

/**
 * Define the allowed types for enrollment status
 */
export type EnrollmentStatus = 'Enrolled' | 'Graduated' | 'On Leave' | 'Suspended';

/**
 * Defines the structure for a Student object.
 * NOTE: This is likely a partial model; the full Student model might extend the User interface.
 */
export interface Student {
    /** The unique identifier for the student. */
    id: string;

    /** The student's first name. */
    firstName: string;

    /** The student's last name. */
    lastName: string;

    /** The student's email address. */
    email: string;

    // FIX: Add the phone property for contact information.
    /** Optional contact phone number. */
    phone?: string;

    /** The student's date of birth. */
    dateOfBirth: Date;

    /** The current enrollment status of the student. */
    enrollmentStatus: EnrollmentStatus;

    // Add other properties as needed, e.g.,
    // address?: string;
    // guardianName?: string;
    // classIds?: string[];
}
