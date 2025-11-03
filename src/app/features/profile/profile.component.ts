// src/app/features/profile/profile.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

// NOTE: This interface should ideally be imported from the ApiService file
// (or a separate models file) to prevent duplication.
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'Faculty';
  department: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: UserProfile | null = null;
  isLoading = true;
  isSaving = false;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    // Fetch profile data and assign it to the local variable for editing
    this.apiService.getProfile().pipe(
      take(1)
    ).subscribe({
        next: (data) => {
            // FIX 1: If data is successfully fetched, assign it to profile
            this.profile = data;
            this.isLoading = false;
        },
        error: (err) => {
            console.error('Error fetching profile:', err);
            this.isLoading = false;
        }
    });
  }

  saveProfile() {
    if (this.profile) {
      this.isSaving = true;
      // Assume apiService has an updateProfile method
      // this.apiService.updateProfile(this.profile).pipe(take(1)).subscribe(...);

      console.log('Attempting to save profile:', this.profile);

      // Simulate API delay for saving
      setTimeout(() => {
        this.isSaving = false;
        alert(`Profile for ${this.profile!.name} updated successfully (Mock)`);
        // Optional: Navigate back or show a success message banner
      }, 1500);

    }
  }

  cancelEdit() {
    // FIX 2: Navigate back to the main dashboard route, which is '/dashboard'
    // according to the fixed app.routes.ts file.
    this.router.navigate(['/dashboard']);
  }
}
