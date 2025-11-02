import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  // Correctly imports CommonModule and RouterLink for template functionality
  imports: [CommonModule, RouterLink],
  // Correctly links to the external HTML file
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Component logic goes here (currently empty as designed)
}
