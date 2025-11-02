import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngFor and *ngIf

@Component({
  selector: 'app-table',
  standalone: true, // Declare as standalone
  imports: [CommonModule], // Import CommonModule
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() data: any[] | null = [];
  @Input() columns: string[] = [];
  @Input() keyMap: string[] = [];

  constructor() { }

  ngOnInit(): void {
    if (this.columns.length !== this.keyMap.length && this.keyMap.length > 0) {
      console.warn('Table Component: Column list and Key Map lengths do not match!');
    }
  }
}
