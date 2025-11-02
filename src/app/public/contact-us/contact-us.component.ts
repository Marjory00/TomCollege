import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router'; // 👈 REMOVED: Not used in the template
import { FormsModule } from '@angular/forms'; // Required for template-driven forms (ngModel, ngForm)

@Component({
  selector: 'app-contact-us',
  // Configure as a standalone component
  standalone: true,
  // Fix: Removed RouterLink from imports as it is not used in the template.
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  // Mock data for key offices used in the HTML template
  contactOffices = [
    { name: 'Admissions Office', email: 'admissions@tomcollege.edu', phone: '(555) 123-4567', focus: 'Application status, visits, general inquiries.' },
    { name: 'Financial Aid', email: 'finaid@tomcollege.edu', phone: '(555) 123-4568', focus: 'Scholarships, grants, FAFSA assistance.' },
    { name: 'Registrar', email: 'registrar@tomcollege.edu', phone: '(555) 123-4569', focus: 'Transcripts, enrollment verification, academic records.' },
    { name: 'IT Help Desk', email: 'helpdesk@tomcollege.edu', phone: '(555) 123-4570', focus: 'Technical support, account access.' }
  ];

  /**
   * Placeholder function to handle the form submission.
   * @param form The value object from the ngForm template variable.
   */
  submitForm(form: any): void {
    console.log('Form Submitted!', form);
    // In a real application, you would implement an HttpClient POST request here.

    // Simple user feedback
    alert(`Thank you, ${form.name}! Your inquiry has been received.`);
  }
}
