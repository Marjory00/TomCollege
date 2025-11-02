// TomCollege/src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    // FIX: Change to false so the app starts on the public homepage ('/')
    private isLoggedIn = false;

    constructor(private router: Router) { }

    login(username: string, password: string): boolean {
        // Mock login logic simplified for development access
        this.isLoggedIn = true;
        this.router.navigate(['/dashboard']);
        return true;
    }

    logout(): void {
        this.isLoggedIn = false;
        this.router.navigate(['/']);
    }

    isAuthenticated(): boolean {
        // FIX: Return the actual state of isLoggedIn.
        // Since we disabled the AuthGuard in app.routes.ts,
        // this is only used for internal component logic now.
        return this.isLoggedIn;
    }
}
