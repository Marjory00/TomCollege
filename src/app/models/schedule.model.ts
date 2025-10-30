// src/app/models/schedule.model.ts

/**
 * Defines the structure for a Schedule object, representing a specific
 * instance of a class happening at a particular time and place.
 */
export interface Schedule {
    /** The unique identifier for the schedule instance. Optional for creation. */
    id?: string;

    /** The ID of the class this schedule belongs to. */
    classId: string;

    /** The name of the associated class (denormalized for quick display). */
    className?: string;

    /** The ID of the teacher responsible for this schedule. */
    teacherId: string;

    /** The day(s) of the week this schedule is active. */
    days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];

    /** The start time of the class (e.g., '09:00'). */
    startTime: string;

    /** The end time of the class (e.g., '10:30'). */
    endTime: string;

    /** The location/room where the class is held. */
    location: string;

    /** The term or semester this schedule is active for. */
    term: string;

    /** The academic year this schedule belongs to. */
    year: number;

    /** A brief note or status update for the schedule (e.g., 'Cancelled on 10/20'). */
    notes?: string;

    /** Creation timestamp (optional, set by the server). */
    createdAt?: Date;

    /** Last updated timestamp (optional, set by the server). */
    updatedAt?: Date;
}
