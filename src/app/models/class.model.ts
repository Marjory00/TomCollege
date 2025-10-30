// src/app/models/class.model.ts

import { User } from './user.model';
// Assuming you have a Student model, if not, it should be created next.
import { Student } from './student.model';

/**
 * Defines the structure for a Class object in the TomCollege system.
 */
export interface Class {
    /** The unique identifier for the class. Optional for creation. */
    id?: string;

    /** The formal name of the class. Matches form control 'name'. */
    name: string;

    /** The short, unique course code (e.g., 'MATH101'). Matches form control 'code'. */
    code: string;

    /** The ID of the teacher assigned to this class. Matches form control 'teacherId'. */
    teacherId: string;

    /** A brief description of the class content. Matches form control 'description'. */
    description?: string;

    /** The maximum number of students allowed in the class. */
    maxStudents: number;

    /** The IDs of the students enrolled in this class. Typically, only IDs are stored here. */
    enrolledStudentIds: string[];

    /** Optional: Full teacher object for frontend display (when populated by the API). */
    teacherDetails?: User;

    /** Optional: Array of student objects for frontend display. */
    enrolledStudentDetails?: Student[];

    /** Optional: Identifier for a separate scheduling entity. */
    scheduleId?: string;

    /** The current status of the class. */
    status: 'Open' | 'Closed' | 'Archived';

    /** Creation timestamp (optional, set by the server). */
    createdAt?: Date;

    /** Last updated timestamp (optional, set by the server). */
    updatedAt?: Date;
}
