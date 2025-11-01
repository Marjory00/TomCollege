import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
// CRITICAL FIX: Import AuthenticatedUser alongside User
import { User, AuthenticatedUser, LoginCredentials, AuthResponse, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  // CRITICAL FIX: Subject now holds AuthenticatedUser | null
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
        // Type cast when parsing from storage
        initialUser = storedUser ? JSON.parse(storedUser) : null;
    }

    this.currentUserSubject = new BehaviorSubject<AuthenticatedUser | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Getter also returns AuthenticatedUser
  public get currentUserValue(): AuthenticatedUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Logs a user into the application.
   * @returns An Observable of the AuthenticatedUser object.
   */
  login(credentials: LoginCredentials): Observable<AuthenticatedUser> {
    // Return type is Observable<AuthenticatedUser>
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        // CRITICAL FIX: Map response to the new AuthenticatedUser type
        map(response => {
            // FIX: Merging response.user and token into AuthenticatedUser
            const authUser: AuthenticatedUser = {
                ...response.user,
                token: response.token
            };

            if (this.isBrowser) {
                localStorage.setItem('currentUser', JSON.stringify(authUser));
            }
            // Subject next call is now correctly typed
            this.currentUserSubject.next(authUser);
            return authUser;
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Registers a new user account. Returns base User as the token is not part of registration response.
   */
  register(userData: RegisterData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  /**
   * Logs the current user out.
   */
  logout(): void {
    if (this.isBrowser) {
        localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Checks if a user is currently logged in.
   */
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Checks if the current user has one of the required roles.
   */
  hasRequiredRole(allowedRoles: string[]): boolean {
    const currentUser = this.currentUserValue;

    if (!currentUser) {
      return false;
    }

    const userRole = currentUser.role;

    return allowedRoles.includes(userRole as string);
  }
}
