// src/app/shared/components/table/table.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for *ngFor, etc.

@Component({
  selector: 'app-table',
  // 💥 FIX: This must be set to true for use in standalone components
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  // Define inputs based on how StudentsComponent uses it
  @Input() data: any[] | null = [];
  @Input() columns: { key: string, header: string }[] = [];
}
