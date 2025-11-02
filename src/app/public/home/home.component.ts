import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // Data for the Academic Programs Showcase
  academicPrograms = [
    {
      name: 'Computer Science & AI',
      image: 'assets/images/program-cs.jpg',
      description: 'Future-proof your career with specializations in Machine Learning, Cybersecurity, and Software Engineering.',
      link: '/academics/cs'
    },
    {
      name: 'Business & Finance',
      image: 'assets/images/program-business.jpg',
      description: 'Hands-on training in global markets, corporate finance, and entrepreneurial ventures through our incubator programs.',
      link: '/academics/business'
    },
    {
      name: 'Health Sciences',
      image: 'assets/images/program-health.jpg',
      description: 'Prepare for medical, dental, or veterinary school with strong clinical partnerships and pre-med advising.',
      link: '/academics/health'
    }
  ];

  // No other data arrays needed as the rest of the HTML remains static.
}
