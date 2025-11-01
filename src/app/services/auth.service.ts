// src/app/services/auth.service.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { User, AuthenticatedUser, LoginCredentials, AuthResponse, RegisterData } from '../models/user.model';

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
        const storedUser = localStorage.getItem('currentUser');
        initialUser = storedUser ? JSON.parse(storedUser) : null;
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

  register(userData: RegisterData): Observable<User> {
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
