// src/app/features/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

// --- IMPORTS FOR CONTENT/DATA ---
import { ApiService } from '../../core/services/api.service';
import { TableComponent } from '../../components/table/table.component';
import { CardComponent } from '../../components/card/card.component';

// --- IMPORTS FOR LAYOUT SHELL ---
// Note: These paths assume Sidebar is a sibling and Navbar is in the 'components' folder.
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';


// --- INTERFACES ---
interface TableColumn {
    key: string;
    header: string;
}

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
        // Content Components
        TableComponent,
        CardComponent,
        // Layout Shell Components
        RouterOutlet,
        SidebarComponent,
        NavbarComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    // --- DATA & STATE ---
    dashboardData$!: Observable<DashboardData>;
    // FIX: Added '!' to assert that this property will be initialized in ngOnInit.
    isDashboardRoot$!: Observable<boolean>;

    recentActivityColumns: TableColumn[] = [
        { key: 'id', header: 'Student ID' },
        { key: 'name', header: 'Student Name' },
        { key: 'course', header: 'Course' },
        { key: 'grade', header: 'Grade' }
    ];

    // --- DEPENDENCY INJECTION ---
    constructor(private apiService: ApiService, private router: Router) { }

    // --- LIFECYCLE HOOK ---
    ngOnInit(): void {
        // 1. Fetch dashboard content data
        this.dashboardData$ = this.apiService.getDashboardData();

        // 2. Logic to detect if the current URL is exactly '/dashboard'
        this.isDashboardRoot$ = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map((event: NavigationEnd) => event.urlAfterRedirects === '/dashboard' || event.urlAfterRedirects === '/dashboard/')
        );
    }
}
