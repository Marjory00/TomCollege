import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// Import necessary components and services
import { ApiService } from '../../core/services/api.service';
import { TableComponent } from '../../components/table/table.component';
import { CardComponent } from '../../components/card/card.component';

// Define the DashboardData structure for clarity
interface DashboardData {
    totalStudents: number;
    activeCourses: number;
    recentEnrollments: number;
    currentGPAAverage: number;
    cardData: { title: string; value: string; icon: string }[];
    tableData: { id: number; name: string; course: string; grade: string }[];
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent, // Used for recent activity
        CardComponent  // Used for metrics
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    // Observable to hold all dashboard data
    // Use the non-null assertion operator ! because it's initialized in ngOnInit
    dashboardData$!: Observable<DashboardData>;

    // Column definitions for the recent activity table
    recentActivityColumns: string[] = ['Student ID', 'Student Name', 'Course', 'Grade'];
    recentActivityKeyMap: string[] = ['id', 'name', 'course', 'grade'];

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        // Fetch the strongly-typed dashboard data using the mock API service
        // Assuming ApiService.getDashboardData() returns Observable<DashboardData>
        this.dashboardData$ = this.apiService.getDashboardData();
    }
}
