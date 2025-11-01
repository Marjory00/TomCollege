// src/app/models/user.model.ts

/**
 * Defines the structure for a general User object in the system.
 * This can represent an Admin, Teacher, or Student.
 */
export interface User {
    // FIX: Standardize on 'id' as the primary identifier (used for routing/services).
    /** The unique identifier for the user. Optional for creation. */
    id?: string;

    /** The user's login email address. */
    email: string;

    /** The user's password (only included when sending registration/login data). */
    password?: string;

    /** The user's access level role. */
    role: 'admin' | 'teacher' | 'student';

    /** The user's first name. */
    firstName: string;

    /** The user's last name. */
    lastName: string;

    /** Optional contact phone number. */
    phone?: string;

    /** Flag indicating if the user account is active. */
    isActive?: boolean;

    /** Creation timestamp (set by the server). */
    createdAt?: Date;

    /** Last updated timestamp (set by the server). */
    updatedAt?: Date;
}

/**
 * Defines the structure for a successful authentication response.
 */
export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
    message?: string;
}

/**
 * Defines the required fields for a login request payload.
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Defines the required fields for a user registration payload.
 */
export interface RegisterData {
    email: string;
    password: string;
    role: 'admin' | 'teacher' | 'student';
    firstName: string;
    lastName: string;
    phone?: string;
}

/**
 * Defines the structure for a generic API response wrapper.
 * T is the type of the data payload (e.g., User, Class[], etc.).
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    count?: number;
}
