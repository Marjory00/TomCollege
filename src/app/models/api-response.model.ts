// src/app/models/api-response.model.ts

/**
 * A generic interface for standard API list responses with pagination metadata.
 * @template T The type of the data items being returned (e.g., Teacher, Student).
 */
export interface ApiResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
