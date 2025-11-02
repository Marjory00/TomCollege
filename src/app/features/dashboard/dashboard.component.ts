import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for async pipe and *ngFor
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

// Import standalone components used in the template
import { CardComponent } from '../../components/card/card.component';
import { TableComponent } from '../../components/table/table.component';

interface CardItem {
  title: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true, // Declare as standalone
  imports: [CommonModule, CardComponent, TableComponent], // Import dependencies
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData$: Observable<any> | undefined;
  cardItems: CardItem[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.dashboardData$ = this.apiService.getDashboardData();

    this.dashboardData$.subscribe(data => {
      // Safely access data once fetched
      this.cardItems = data.cardData;
    });
  }
}
