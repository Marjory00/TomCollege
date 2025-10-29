
// src/app/guards/role.guard.ts

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const expectedRoles: string[] = route.data['roles'];
    const currentUser = this.authService.currentUserValue;

    if (currentUser && expectedRoles && expectedRoles.includes(currentUser.role)) {
      return true;
    }

    // Not authorized, redirect to dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}
