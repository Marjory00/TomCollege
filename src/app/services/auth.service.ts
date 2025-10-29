// src/app/services/auth.service.ts (Final SSR-Safe Version)

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginResponse } from '../models/user.model';
import { environment } from '@env/environment'; // Assuming @env/environment is correctly configured in tsconfig

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    private isBrowser: boolean;

    constructor(
        private http: HttpClient,
        private router: Router,
        // Injects the platform token
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        // 🚨 CRITICAL SSR GUARD 1: Determine platform immediately
        this.isBrowser = isPlatformBrowser(this.platformId);

        let initialUser: User | null = null;

        // 🚨 CRITICAL SSR GUARD 2: Only access localStorage if in the browser
        if (this.isBrowser) {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                try {
                    initialUser = JSON.parse(storedUser);
                } catch (e) {
                    console.error('Error parsing stored user:', e);
                }
            }
        }
        // If not a browser, initialUser remains null, preventing crash

        this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(credentials: any): Observable<User> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
            .pipe(
                map(response => {
                    const user = response.data;
                    // Note: This line depends on LoginResponse having 'token' property
                    user.token = response.token;

                    // 🚨 SSR GUARD: Only save to localStorage in the browser
                    if (this.isBrowser) {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                    }
                    this.currentUserSubject.next(user);
                    return user;
                }),
                catchError(error => throwError(() => error))
            );
    }

    logout(): void {
        // 🚨 SSR GUARD: Only clear localStorage in the browser
        if (this.isBrowser) {
            localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    public getToken(): string | null {
        // 🚨 SSR GUARD: Return null immediately on the server
        if (!this.isBrowser) {
            return null;
        }
        const user = this.currentUserSubject.value;
        return user && user.token ? user.token : null;
    }

    hasRole(roles: string[]): boolean {
        const user = this.currentUserSubject.value;
        if (!user || !user.role) {
            return false;
        }
        return roles.includes(user.role);
    }
}
