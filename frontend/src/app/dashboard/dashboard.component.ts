import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
// Import Chart.js - we need to register all parts we use
import {
  Chart,
  LineController, LineElement, PointElement, LinearScale, CategoryScale,
  DoughnutController, ArcElement, Tooltip, Legend, Title,
  Filler,  // ← Required for fill: true (shaded area under line chart)
} from 'chart.js';

// Register Chart.js components (required in modern Chart.js)
Chart.register(
  LineController, LineElement, PointElement, LinearScale, CategoryScale,
  DoughnutController, ArcElement, Tooltip, Legend, Title,
  Filler   // ← Must register Filler or chart throws a warning and area won't fill
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Overview metric cards
  overview = {
    totalUsers: 0,
    activeUsers: 0,
    totalAdmins: 0,
    newSignups: 0,
  };

  // Logged-in user's name
  adminName = '';

  // Store chart instances so we can destroy them later
  private lineChart: Chart | null = null;
  private doughnutChart: Chart | null = null;

 
  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef  // ← inject this
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    this.adminName = user?.name || 'Admin';

    this.api.getOverview().subscribe({
      next: (data) => {
        this.overview = { ...data }; 
        this.cdr.detectChanges();    
      },
      error: (err) => {
        console.error('Overview fetch failed:', err);
      }
    });

    this.api.getSignupTrend().subscribe({
      next: (data) => {
        this.buildLineChart(data);
      },
      error: (err) => console.error('Signup trend fetch failed:', err)
    });

    this.api.getRoleDistribution().subscribe({
      next: (data) => {
        this.buildDoughnutChart(data);
      },
      error: (err) => console.error('Role distribution fetch failed:', err)
    });
  }

  
  ngOnDestroy() {
    this.lineChart?.destroy();
    this.doughnutChart?.destroy();
  }

  buildLineChart(signupData: any) {
    if (!signupData) return;

    this.lineChart?.destroy();

    this.lineChart = new Chart('signupChart', {
      type: 'line',
      data: {
        labels: signupData.labels,
        datasets: [
          {
            label: 'New Sign-ups',
            data: signupData.counts,
            borderColor: '#4361ee',     
            backgroundColor: 'rgba(67, 97, 238, 0.1)', 
            fill: true,
            tension: 0.4,               
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Sign-ups (Last 7 Days)' },
        },
      },
    });
  }

  buildDoughnutChart(roleData: any) {
    if (!roleData) return;

    this.doughnutChart?.destroy();

    this.doughnutChart = new Chart('roleChart', {
      type: 'doughnut',
      data: {
        labels: roleData.labels,
        datasets: [
          {
            data: roleData.counts,
            backgroundColor: ['#f72585', '#4361ee'], // Colors for each slice
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'User Role Distribution' },
        },
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}