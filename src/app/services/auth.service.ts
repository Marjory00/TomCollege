import { Injectable, PLATFORM_ID, Inject } from '@angular/core'; // <-- NEW IMPORTS: PLATFORM_ID, Inject
import { isPlatformBrowser } from '@angular/common'; // <-- NEW IMPORT: isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  // Property to store the platform check result
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // <-- Inject PLATFORM_ID
  ) {
    // Determine if the code is running in a browser
    this.isBrowser = isPlatformBrowser(this.platformId);

    let initialUser: User | null = null;

    if (this.isBrowser) {
        // Access localStorage ONLY if running in the browser
        const storedUser = localStorage.getItem('currentUser');
        initialUser = storedUser ? JSON.parse(storedUser) : null;
    }

    // Initialize BehaviorSubject safely
    this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            // Conditional localStorage update
            if (this.isBrowser) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('currentUser', JSON.stringify(response.user));
            }
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            // Conditional localStorage update
            if (this.isBrowser) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('currentUser', JSON.stringify(response.user));
            }
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    // Conditional localStorage removal
    if (this.isBrowser) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  updateProfile(data: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateprofile`, data);
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatepassword`, {
      currentPassword,
      newPassword
    });
  }

  isAuthenticated(): boolean {
    // Conditional check
    return this.isBrowser ? !!localStorage.getItem('token') : !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    // Conditional retrieval
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    return user ? roles.includes(user.role) : false;
  }
}
