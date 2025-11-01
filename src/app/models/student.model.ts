// src/app/models/student.model.ts

// We need Omit to extend User and RegisterData while overriding 'status'
import { User, RegisterData } from './user.model';
import { Teacher } from './teacher.model'; // Assuming Teacher is needed to define the advisor type

/**
 * Defines the structure for a Student entity.
 * * CRITICAL FIX: Use Omit<User, 'status'> to remove the incompatible
 * status property from the base interface before adding the student-specific status.
 */
export interface Student extends Omit<User, 'status'> {
    // Overrides the role property to ensure it is always 'student'.
    role: 'student';

    // Status is explicitly redefined here to include student-specific statuses
    status: 'Active' | 'Graduated' | 'Withdrawn' | 'Suspended';

    /** Year or level of study (e.g., '10th Grade', 'Freshman'). */
    gradeLevel: string;

    /** Date the student enrolled in the institution. */
    enrollmentDate: Date | string;

    /** Unique IDs of classes the student is currently enrolled in. */
    enrolledClassIds: string[];

    /** The unique ID of the student's primary advisor/homeroom teacher. */
    advisorId: string;

    /** Optional: Full advisor details, often populated during a fetch. */
    advisor?: Teacher;
}

/**
 * Defines the structure for creating a new Student via the API.
 * Uses Omit<RegisterData, 'status'> to remove the incompatible status property.
 */
export interface NewStudentData extends Omit<RegisterData, 'status'> {
    // These fields are required for the student profile creation
    gradeLevel: string;
    advisorId: string;

    // Ensure the role is set correctly during creation
    role: 'student';

    // Status is now correctly defined with the extended student statuses
    status?: 'Active' | 'Graduated' | 'Withdrawn' | 'Suspended';
}
