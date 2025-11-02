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
    status: 'Active' | 'Inactive' | 'Suspended' | 'On Leave' | 'Retired' | 'Graduated' | 'Withdrawn' | 'On Probation';
    dateJoined?: string;
}

/**
 * User data including the JWT token, used after login.
 */
export interface AuthenticatedUser extends User {
    token: string;
}

// Data model for registration/creation requests
export interface NewUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role: 'admin' | 'teacher' | 'student';
}

/**
 * Interface used specifically for login requests.
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Common API response after successful login/register.
 */
export interface AuthResponse {
    user: User;
    token: string;
    expiresIn: number; // e.g., token lifetime in seconds
}
