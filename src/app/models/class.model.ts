// src/app/models/class.model.ts

import { User } from './user.model';
// Assuming Student is a defined interface or type
import { Student } from './student.model';

/**
 * Defines the structure for a Class object in the TomCollege system.
 */
export interface Class {
    /** The unique identifier for the class. Optional for creation. */
    id?: string;

    /** The formal name of the class. Matches form control 'name'. */
    name: string;

    // FIX 1: Integrated and typed the 'department' property
    /** The academic department offering the class (e.g., 'Science', 'Mathematics'). */
    department: string;

    // FIX 2: Integrated and typed the 'creditHours' property
    /** The number of credit hours the class is worth. */
    creditHours: number;

    // FIX 3: Renamed 'classCode' to 'courseCode' and kept it unique/required.
    /** The short, unique course code (e.g., 'MATH101'). */
    courseCode: string;

    /** Boolean flag indicating if the class is currently running or open for enrollment. */
    isActive: boolean;

    /** The ID of the teacher assigned to this class. */
    teacherId: string;

    /** The full name of the teacher assigned to this class (for display). */
    teacherName?: string;

    /** A brief description of the class content. */
    description?: string;

    /** The maximum number of students allowed in the class. */
    maxStudents: number;

    /** The IDs of the students enrolled in this class. */
    enrolledStudentIds: string[];

    /** Optional: Full teacher object for frontend display. */
    teacherDetails?: User;

    /** Optional: Array of student objects for frontend display. */
    enrolledStudentDetails?: Student[];

    /** Optional: Identifier for a separate scheduling entity. */
    scheduleId?: string;

    /** The current status of the class (used internally or for complex state). */
    status: 'Open' | 'Closed' | 'Archived';

    /** Creation timestamp (optional, set by the server). */
    createdAt?: Date;

    /** Last updated timestamp (optional, set by the server). */
    updatedAt?: Date;
}
