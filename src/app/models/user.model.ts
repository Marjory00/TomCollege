// src/app/models/user.model.ts

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
    message?: string;
}
