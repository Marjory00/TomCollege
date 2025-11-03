// src/app/features/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ApiService } from '../../core/services/api.service'; // Correctly imported
import { TableComponent } from '../../components/table/table.component';
import { CardComponent } from '../../components/card/card.component';

interface TableColumn {
    key: string;
    header: string;
}

// FIX 4: Define a robust interface for the data received from the API
interface DashboardData {
    totalStudents: number;
    activeCourses: number;
    recentEnrollments: number;
    currentGPAAverage: number;
    // Data for the CardComponent
    cardData: { title: string; value: string; icon: string }[];
    // Data for the TableComponent
    tableData: { id: number; name: string; course: string; grade: string }[];
}


@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        CardComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    dashboardData$!: Observable<DashboardData>;

    // FIX 5: Define columns in the object array format required by <app-table>
    recentActivityColumns: TableColumn[] = [
        { key: 'id', header: 'Student ID' },
        { key: 'name', header: 'Student Name' },
        { key: 'course', header: 'Course' },
        { key: 'grade', header: 'Grade' }
    ];


    // FIX: Correctly inject ApiService
    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.dashboardData$ = this.apiService.getDashboardData();
    }
}
