// src/app/models/user.model.ts

/** * Defines the core properties for all users in the system.
 */
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: 'admin' | 'teacher' | 'student';
    dateJoined: string;

    // FIX: Expanded 'status' type to include all known derived statuses.
    // This allows the Teacher interface to correctly extend User.
    status: 'Active' | 'Inactive' | 'Suspended' | 'On Leave' | 'Retired';
}

// Data model for registration/creation requests
export interface NewUser {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
    role: 'admin' | 'teacher' | 'student';
    dateJoined: string;
}
