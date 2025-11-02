import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-academic-departments',
  standalone: true,
  imports: [CommonModule, RouterLink], // ⬅️ FIX: Added the missing comma here
  templateUrl: './academic-departments.component.html',
  styleUrls: ['./academic-departments.component.css']
})
export class AcademicDepartmentsComponent {

  // Data array kept for context (no changes needed here)
  readonly academicSchools = [
    {
      name: "School of Arts & Humanities",
      description: "Explore culture, language, and creativity.",
      icon: "palette",
      departments: [
        { name: "English Literature", link: "/academics/english" },
        { name: "History", link: "/academics/history" },
        { name: "Philosophy", link: "/academics/philosophy" },
        { name: "Modern Languages", link: "/academics/languages" }
      ]
    },
    {
      name: "College of Science & Technology",
      description: "Lead innovation in engineering, computation, and natural sciences.",
      icon: "rocket_launch",
      departments: [
        { name: "Computer Science", link: "/academics/cs" },
        { name: "Electrical Engineering", link: "/academics/ee" },
        { name: "Biology", link: "/academics/bio" },
        { name: "Physics & Astronomy", link: "/academics/physics" }
      ]
    },
    {
      name: "School of Business & Economics",
      description: "Prepare for leadership roles in global finance and commerce.",
      icon: "analytics",
      departments: [
        { name: "Accounting", link: "/academics/accounting" },
        { name: "Finance", link: "/academics/finance" },
        { name: "Marketing", link: "/academics/marketing" },
        { name: "Economics", link: "/academics/economics" }
      ]
    },
    {
      name: "School of Health & Social Policy",
      description: "Focus on human wellness and shaping effective public policy.",
      icon: "public",
      departments: [
        { name: "Sociology", link: "/academics/sociology" },
        { name: "Public Health", link: "/academics/public-health" },
        { name: "Political Science", link: "/academics/poli-sci" }
      ]
    }
  ];

  /**
   * Method to clean school name for use in URLs/IDs.
   */
  cleanSchoolName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  }
}
