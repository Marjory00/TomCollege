// src/app/models/api-response.model.ts

/**
 * Defines the standard structure for paginated API responses
 * used across the Teacher and Student services.
 */
export interface ApiResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    message?: string; // Optional: for success/error messages
}
