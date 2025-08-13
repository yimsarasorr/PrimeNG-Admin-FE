import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 

// PrimeNG Modules
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { SplitterModule } from 'primeng/splitter';
import { CardModule } from 'primeng/card';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SidebarModule,
    InputTextModule,
    ChartModule,
    TableModule,
    PanelModule,
    AvatarModule,
    RippleModule,
    SplitterModule,
    CardModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sidebarVisible = true;
  chartData: any;
  chartOptions: any;
  themeMode: 'light' | 'dark' = 'light';
  chartRange: 'week' | 'month' | 'year' = 'week';

  visitorStats = [
    { name: 'Total Visitors', value: 120 },
    { name: 'Checked In', value: 45 },
    { name: 'Checked Out', value: 75 }
  ];

  visitorLogs = [
    { id: 1, name: 'John Doe', date: '2023-10-01', status: 'Checked In', time: '10:00 AM', purpose: 'Meeting' },
    { id: 2, name: 'Jane Smith', date: '2023-10-01', status: 'Checked Out', time: '11:00 AM', purpose: 'Conference' },
    { id: 3, name: 'Alice Johnson', date: '2023-10-01', status: 'Checked In', time: '09:30 AM', purpose: 'Interview' }
  ];

  ngOnInit() {
    this.updateTheme();
    this.updateChart();
  }

  toggleTheme(): void {
    this.themeMode = this.themeMode === 'light' ? 'dark' : 'light';
    this.updateTheme();
    this.updateChart();
  }

  setChartRange(range: 'week' | 'month' | 'year'): void {
    this.chartRange = range;
    this.updateChart();
  }

  updateChart(): void {
    let labels: string[] = [];
    let datasets: any[] = [];

    switch (this.chartRange) {
      case 'week':
        labels = ['11 jul', '18 jul', '25 jul', '1 aug', '8 aug', '15 aug', '22 aug'];
        datasets = [{ type: 'bar', label: 'Visitors', backgroundColor: '#3b82f6', data: [12, 19, 14, 17, 22, 25, 20] }];
        break;
      case 'month':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
        datasets = [{ type: 'bar', label: 'Visitors', backgroundColor: '#3b82f6', data: [80, 95, 110, 90, 120, 130, 140, 150] }];
        break;
      case 'year':
        labels = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
        datasets = [{ type: 'bar', label: 'Visitors', backgroundColor: '#3b82f6', data: [1500, 1800, 2000, 2200, 2500, 2700, 3000, 3200, 3500] }];
        break;
    }

    const isDark = this.themeMode === 'dark';
    const textColor = isDark ? '#ffffff' : '#1e293b';
    const textSecondary = isDark ? '#cbd5e1' : '#64748b';
    const surfaceBorder = isDark ? '#334155' : '#e0e7ef';

    this.chartData = { labels, datasets };
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { stacked: true, ticks: { color: textSecondary }, grid: { color: surfaceBorder } },
        y: { stacked: true, ticks: { color: textSecondary }, grid: { color: surfaceBorder } }
      }
    };
  }

  updateTheme(): void {
    const isDark = this.themeMode === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
  }
}
