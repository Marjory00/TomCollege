import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators'; // Added for clean subscription

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
  templateUrl: './profile.component.html', // <-- FIXED: Use separate template file
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // FIX APPLIED: Store profile data locally for two-way binding
  profile: UserProfile | null = null;

  // Optional: Observable for the initial load state (not strictly needed now)
  isLoading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // FIX APPLIED: Subscribe and map the Observable data to the local variable
    this.apiService.getProfile().pipe(
      take(1) // Ensures we only fetch once
    ).subscribe(data => {
      this.profile = data;
      this.isLoading = false;
    });
  }

  saveProfile() {
    if (this.profile) {
      // Placeholder for saving data via API
      console.log('Saving profile:', this.profile);
      // this.apiService.updateProfile(this.profile).subscribe(...);
      alert(`Profile for ${this.profile.name} updated successfully (Mock)`);
    }
  }
}
