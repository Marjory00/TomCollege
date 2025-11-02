// src/app/services/auth.service.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { User, AuthenticatedUser, LoginCredentials, AuthResponse, NewUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject: BehaviorSubject<AuthenticatedUser | null>;
  public currentUser: Observable<AuthenticatedUser | null>;

  private isBrowser: boolean;

  constructor(
    @Inject(HttpClient) private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    let initialUser: AuthenticatedUser | null = null;

    if (this.isBrowser) {
        // MOCK USER for testing purposes (Admin role)
        const mockUser: AuthenticatedUser = {
            id: 'U001',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@tomcollege.edu',
            role: 'admin',
            status: 'Active',
            token: 'mock-auth-token-123'
        };
        // For production, you'd read from localStorage:
        // const storedUser = localStorage.getItem('currentUser');
        // initialUser = storedUser ? JSON.parse(storedUser) : null;
        initialUser = mockUser;
    }

    this.currentUserSubject = new BehaviorSubject<AuthenticatedUser | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthenticatedUser | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<AuthenticatedUser> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
            const authUser: AuthenticatedUser = {
                ...response.user,
                token: response.token
            };

            if (this.isBrowser) {
                localStorage.setItem('currentUser', JSON.stringify(authUser));
            }
            this.currentUserSubject.next(authUser);
            return authUser;
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  register(userData: NewUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    if (this.isBrowser) {
        localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRequiredRole(allowedRoles: string[]): boolean {
    const currentUser = this.currentUserValue;
    if (!currentUser) {
      return false;
    }
    const userRole = currentUser.role;
    return allowedRoles.includes(userRole as string);
  }
}
