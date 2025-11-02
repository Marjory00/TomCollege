import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  // Correctly uses RouterLink for internal navigation
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  // Correctly calculates the current year for the copyright notice
  currentYear: number = new Date().getFullYear();
}
