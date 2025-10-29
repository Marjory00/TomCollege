// src/app/models/user.model.ts

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';

  // 🚨 FIX: Add optional token property to User to satisfy AuthService.getToken()
  token?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    firstName: string;
    lastName: string;
}

// Renamed from AuthResponse to LoginResponse for clarity (matches AuthService usage)
export interface LoginResponse {
    success: boolean;
    // Assuming your API returns the token and user data at the top level:
    token: string;
    // We will keep 'data: User' to align with the response structure often used by APIs
    data: User;
    message?: string;
}
