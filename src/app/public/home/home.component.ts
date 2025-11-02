import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <-- ADD THIS

@Component({
  selector: 'app-home',
  standalone: true,
  // FIX: Added RouterLink to enable navigation
  imports: [CommonModule, RouterLink],
  template: `
    <div class="public-page home-page">
      <div class="hero-section">
        <h1>Welcome to TomCollege!</h1>
        <p>A tradition of excellence in education and innovation.</p>
        <a routerLink="/admissions" class="btn-primary">Apply Now</a>
        <a routerLink="/login" class="btn-secondary">Student/Faculty Login</a>
      </div>

      <section class="features-section">
        <h2>Why Choose TomCollege?</h2>
        <div class="feature-cards">
          <div class="card">World-Class Faculty</div>
          <div class="card">Cutting-Edge Research</div>
          <div class="card">Vibrant Campus Life</div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent { }
