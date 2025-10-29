import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
import { ClassService } from '../../services/class.service';
import { ScheduleService } from '../../services/schedule.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats = {
    totalStudents: 0,
    totalClasses: 0,
    totalSchedules: 0,
    activeEnrollments: 0
  };
  loading = true;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private classService: ClassService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    if (this.currentUser?.role === 'admin' || this.currentUser?.role === 'teacher') {
      // Load statistics for admin and teacher
      this.studentService.getAllStudents().subscribe({
        next: (response) => {
          this.stats.totalStudents = response.count || 0;
        },
        error: (error) => console.error('Error loading students:', error)
      });

      this.classService.getAllClasses().subscribe({
        next: (response) => {
          this.stats.totalClasses = response.count || 0;
          this.stats.activeEnrollments = response.data?.reduce(
            (sum: number, cls: any) => sum + (cls.enrolledStudents?.length || 0),
            0
          ) || 0;
        },
        error: (error) => console.error('Error loading classes:', error)
      });

      this.scheduleService.getAllSchedules().subscribe({
        next: (response) => {
          this.stats.totalSchedules = response.count || 0;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading schedules:', error);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
