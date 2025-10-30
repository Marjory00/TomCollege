import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../models/user.model';

// Mock data for immediate dashboard access and display
const MOCK_USER: User = {
    id: 'mock-admin-123',
    email: 'admin@tomcollege.edu',
    firstName: 'Mock',
    lastName: 'Admin',
    role: 'admin' // Ensure role is set for role-based features
};

// Mock AuthResponse defined for successful login/register simulation
const MOCK_AUTH_RESPONSE: AuthResponse = {
    success: true,
    token: 'MOCK_JWT_TOKEN_FOR_DEV',
    user: MOCK_USER
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;
    private isBrowser: boolean;

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        let initialUser: User | null = null;

        if (this.isBrowser) {
            const storedUser = localStorage.getItem('currentUser');
            initialUser = storedUser ? JSON.parse(storedUser) : null;
        }

        // Final Mockup Fix: If no user is found, force the MOCK_USER object for the demo.
        if (!initialUser) {
            initialUser = MOCK_USER;
            if (this.isBrowser) {
                localStorage.setItem('currentUser', JSON.stringify(MOCK_USER));
                localStorage.setItem('token', 'MOCK_JWT_TOKEN_FOR_DEV');
            }
        }

        this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Authenticates a user (MOCK IMPLEMENTATION).
     * 🚨 FIX 1: Defined the required 'login' method to resolve the TS2339 error.
     */
    login(credentials: LoginCredentials): Observable<AuthResponse> {
        // --- TEMPORARY MOCKUP IMPLEMENTATION ---
        console.warn('--- MOCK LOGIN ACTIVE: Bypassing API for development ---');

        return new Observable<AuthResponse>(observer => {
            // Simulate success for any credentials to allow testing the LoginComponent form logic
            observer.next(MOCK_AUTH_RESPONSE);
            observer.complete();
        }).pipe(
            tap(response => {
                if (response.success && response.token) {
                    if (this.isBrowser) {
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('currentUser', JSON.stringify(response.user));
                    }
                    this.currentUserSubject.next(response.user);
                    this.router.navigate(['/dashboard']);
                }
            })
        );
        // --- END MOCKUP IMPLEMENTATION ---
    }

    /**
     * Registers a new user (MOCK IMPLEMENTATION).
     * 🚨 FIX 2: Defined the 'register' method, often called by the LoginComponent.
     */
    register(data: RegisterData): Observable<AuthResponse> {
        // --- TEMPORARY MOCKUP IMPLEMENTATION ---
        console.warn('--- MOCK REGISTER ACTIVE: Bypassing API for development ---');

        return new Observable<AuthResponse>(observer => {
            // Simulate success
            observer.next(MOCK_AUTH_RESPONSE);
            observer.complete();
        }).pipe(
            tap(response => {
                if (response.success && response.token) {
                    if (this.isBrowser) {
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('currentUser', JSON.stringify(response.user));
                    }
                    this.currentUserSubject.next(response.user);
                    this.router.navigate(['/dashboard']);
                }
            })
        );
        // --- END MOCKUP IMPLEMENTATION ---
    }

    /**
     * Calls the AuthService logout method to clear tokens and redirect.
     */
    logout(): void {
        if (this.isBrowser) {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            // Re-initialize local storage with mock user so the dashboard reloads correctly
            localStorage.setItem('currentUser', JSON.stringify(MOCK_USER));
            localStorage.setItem('token', 'MOCK_JWT_TOKEN_FOR_DEV');
        }
        this.currentUserSubject.next(MOCK_USER); // Revert to mock user on logout
        this.router.navigate(['/dashboard']); // Redirect to dashboard immediately after "logout" for the demo
    }

    hasRole(roles: string[]): boolean {
        const user = this.currentUserValue;
        return user ? roles.includes(user.role) : false;
    }

    getToken(): string | null {
        return this.isBrowser ? localStorage.getItem('token') : null;
    }
}
