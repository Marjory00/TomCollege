// src/app/models/schedule.model.ts

export interface Schedule {
    id: string;
    studentId: string;
    teacherId: string;
    courseId: string;

    // Properties used by the main schedule list view
    className: string;
    location: string;
    days: string[]; // ['Mon', 'Wed', 'Fri']
    startTime: string; // e.g., '09:00 AM'
    endTime: string;   // e.g., '10:30 AM'
    term: 'Fall' | 'Spring' | 'Summer';
    year: number;
    notes?: string;

    // Properties used by the add/edit form (basic version)
    dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    timeSlot: string; // e.g., '9:00 AM - 10:00 AM'
}
