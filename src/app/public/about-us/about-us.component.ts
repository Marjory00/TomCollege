import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  // Simple data for the mission/vision cards
  missionCards = [
    {
      title: 'Our Mission',
      icon: 'school',
      text: 'To foster intellectual curiosity, critical thinking, and ethical leadership among a diverse student body, preparing them for a global future.'
    },
    {
      title: 'Our Vision',
      icon: 'insights',
      text: 'To be a premier institution recognized globally for academic excellence, transformative research, and profound societal impact.'
    },
    {
      title: 'Our Values',
      icon: 'gavel',
      text: 'Integrity, Community, Innovation, and Service define the TomCollege experience and drive our daily operations.'
    }
  ];
}
