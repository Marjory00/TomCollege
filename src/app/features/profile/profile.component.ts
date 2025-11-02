// src/app/features/profile/profile.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router'; // 🆕 FIX: Import Router for navigation/redirection

// ⚠️ NOTE: This interface should ideally be imported from the ApiService file
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
  isSaving = false; // 🆕 FIX: Added state for Save button loading

  // 🆕 FIX: Added Router for potential navigation after save/cancel
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    // Fetch profile data and assign it to the local variable for editing
    this.apiService.getProfile().pipe(
      take(1)
    ).subscribe({
        next: (data) => {
            this.profile = data;
            this.isLoading = false;
        },
        error: (err) => {
            console.error('Error fetching profile:', err);
            this.isLoading = false;
            // Handle error state in template if needed
        }
    });
  }

  saveProfile() {
    if (this.profile) {
      this.isSaving = true;
      // Placeholder for saving data via API (e.g., PUT request)
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
    // Simply navigate back to the dashboard home page
    this.router.navigate(['/dashboard/home']);
  }
}
