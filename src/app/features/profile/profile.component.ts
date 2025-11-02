import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Needed for form inputs

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
  template: `
    <div class="profile-page">
      <h2>👤 User Profile</h2>
      <p>Manage your account details and information.</p>

      <ng-container *ngIf="profile$ | async as profile">
        <form class="profile-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input id="name" type="text" [(ngModel)]="profile.name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" [(ngModel)]="profile.email" name="email" required>
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <input id="role" type="text" [value]="profile.role" disabled>
          </div>
          <div class="form-group">
            <label for="dept">Department</label>
            <input id="dept" type="text" [value]="profile.department" disabled>
          </div>
          <button type="submit" (click)="saveProfile(profile)">Save Changes</button>
        </form>
      </ng-container>
    </div>
  `,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile$: Observable<UserProfile> | undefined;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Assuming the API service fetches the current user's profile
    this.profile$ = this.apiService.getProfile();
  }

  saveProfile(profile: UserProfile) {
    // Placeholder for saving data via API
    console.log('Saving profile:', profile);
    // this.apiService.updateProfile(profile).subscribe(...);
    alert('Profile updated successfully (Mock)');
  }
}
