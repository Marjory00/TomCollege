// src/app/models/student.model.ts

/**
 * Defines the structure for a Student object in the TomCollege system.
 * It often mirrors some properties of the general User model but may include
 * specific academic or enrollment details.
 */
export interface Student {
    /** The unique identifier for the student. Optional for creation. */
    id?: string;

    /** The student's system username or email address. */
    email: string;

    /** The student's password hash (should typically not be retrieved/sent to the client). */
    password?: string;

    /** The student's role (should be 'student'). */
    role: 'student';

    /** The student's first name. */
    firstName: string;

    /** The student's last name. */
    lastName: string;

    /** The student's full name (often calculated or denormalized for display). */
    fullName?: string;

    /** The date of birth. */
    dateOfBirth?: Date;

    /** The student's current enrollment status. */
    enrollmentStatus: 'Enrolled' | 'Graduated' | 'On Leave' | 'Suspended';

    /** A list of class IDs the student is currently enrolled in. */
    enrolledClassIds: string[];

    /** Optional: The student's major or primary area of study. */
    major?: string;

    /** Creation timestamp (optional, set by the server). */
    createdAt?: Date;

    /** Last updated timestamp (optional, set by the server). */
    updatedAt?: Date;
}
