// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common'; 

// // PrimeNG Modules
// import { SidebarModule } from 'primeng/sidebar';
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { ChartModule } from 'primeng/chart';
// import { TableModule } from 'primeng/table';
// import { PanelModule } from 'primeng/panel';
// import { AvatarModule } from 'primeng/avatar';
// import { RippleModule } from 'primeng/ripple';
// import { SplitterModule } from 'primeng/splitter';
// import { CardModule } from 'primeng/card';



// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ButtonModule,
//     SidebarModule,
//     InputTextModule,
//     ChartModule,
//     TableModule,
//     PanelModule,
//     AvatarModule,
//     RippleModule,
//     SplitterModule,
//     CardModule
//   ],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {
//   sidebarVisible = true;
//   chartData: any;
//   chartOptions: any;
//   themeMode: 'light' | 'dark' = 'light';
//   chartRange: 'week' | 'month' | 'year' = 'week';

//   visitorStats = [
//     { name: 'Total Visitors', value: 120 },
//     { name: 'Checked In', value: 45 },
//     { name: 'Checked Out', value: 75 }
//   ];

//   visitorLogs = [
//     { id: 1, name: 'John Doe', date: '2023-10-01', status: 'Checked In', time: '10:00 AM', purpose: 'Meeting' },
//     { id: 2, name: 'Jane Smith', date: '2023-10-01', status: 'Checked Out', time: '11:00 AM', purpose: 'Conference' },
//     { id: 3, name: 'Alice Johnson', date: '2023-10-01', status: 'Checked In', time: '09:30 AM', purpose: 'Interview' }
//   ];

//   ngOnInit() {
//     this.updateTheme();
//     this.updateChart();
//   }

//   toggleTheme(): void {
//     this.themeMode = this.themeMode === 'light' ? 'dark' : 'light';
//     this.updateTheme();
//     this.updateChart();
//   }

//   setChartRange(range: 'week' | 'month' | 'year'): void {
//     this.chartRange = range;
//     this.updateChart();
//   }

//   updateChart(): void {
//     let labels: string[] = [];
//     let datasets: any[] = [];

//     switch (this.chartRange) {
//       case 'week':
//         labels = ['11 jul', '18 jul', '25 jul', '1 aug', '8 aug', '15 aug', '22 aug'];
//         datasets = [{ type: 'bar', label: 'Visitors', backgroundColor: '#3b82f6', data: [12, 19, 14, 17, 22, 25, 20] }];
//         break;
//       case 'month':
//         labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
//         datasets = [{ type: 'bar', label: 'Visitors', backgroundColor: '#3b82f6', data: [80, 95, 110, 90, 120, 130, 140, 150] }];
//         break;
//       case 'year':
//         labels = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
//         datasets = [{ type: 'bar', label: 'Visitors', backgroundColor: '#3b82f6', data: [1500, 1800, 2000, 2200, 2500, 2700, 3000, 3200, 3500] }];
//         break;
//     }

//     const isDark = this.themeMode === 'dark';
//     const textColor = isDark ? '#ffffff' : '#1e293b';
//     const textSecondary = isDark ? '#cbd5e1' : '#64748b';
//     const surfaceBorder = isDark ? '#334155' : '#e0e7ef';

//     this.chartData = { labels, datasets };
//     this.chartOptions = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: { labels: { color: textColor } },
//         tooltip: { mode: 'index', intersect: false }
//       },
//       scales: {
//         x: { stacked: true, ticks: { color: textSecondary }, grid: { color: surfaceBorder } },
//         y: { stacked: true, ticks: { color: textSecondary }, grid: { color: surfaceBorder } }
//       }
//     };
//   }

//   updateTheme(): void {
//     const isDark = this.themeMode === 'dark';
//     document.body.classList.toggle('dark-mode', isDark);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG modules
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { MeterGroupModule } from 'primeng/metergroup';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    BadgeModule,
    InputTextModule,
    SelectButtonModule,
    CalendarModule,
    ChartModule,
    TableModule,
    AvatarModule,
    TagModule,
    MeterGroupModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedPeriod: string = 'Monthly';

  chartData: any;
  chartOptions: any;

  visitorLogs = [
    { id: 1, name: 'John Doe', type: 'Employee', date: '2025-08-28', status: 'Checked In', time: '08:45', purpose: 'Work' },
    { id: 2, name: 'Jane Smith', type: 'Guest', date: '2025-08-28', status: 'Checked Out', time: '10:30', purpose: 'Meeting' },
    { id: 3, name: 'Alice Johnson', type: 'Contractor', date: '2025-08-28', status: 'Checked In', time: '09:15', purpose: 'Maintenance' },
    { id: 4, name: 'Bob Lee', type: 'Guest', date: '2025-08-28', status: 'Checked In', time: '11:00', purpose: 'Interview' }
  ];

  visitorTypes = [
    { label: 'Building A', value: 60, color: '#3b82f6' },
    { label: 'Building B', value: 25, color: '#60a5fa' },
    { label: 'Building C', value: 15, color: '#93c5fd' }
  ];

  ngOnInit(): void {
    this.initChart();
    this.loadVisitorLogs();
    this.loadVisitorTypes();
  }

  initChart() {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Employees',
          backgroundColor: '#3b82f6',
          data: [120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230]
        },
        {
          label: 'Guests',
          backgroundColor: '#60a5fa',
          data: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190]
        },
        {
          label: 'Contractors',
          backgroundColor: '#93c5fd',
          data: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 100]
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#1e293b', font: { size: 14, weight: 'bold' } } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: '#64748b', font: { size: 13 } },
          grid: { color: '#f3f4f6' }
        },
        y: {
          stacked: true,
          ticks: {
            color: '#64748b',
            font: { size: 12 },
            stepSize: 100
          },
          grid: { color: '#f3f4f6' },
          min: 0,
          max: 1000
        }
      },
      elements: {
        bar: {
          borderRadius: 8
        },

      }
    };
  }

  loadVisitorLogs() {
    this.visitorLogs = [
      { id: 1, name: 'John Doe', type: 'Employee', date: '2025-08-28', status: 'Checked In', time: '08:45', purpose: 'Work' },
      { id: 2, name: 'Jane Smith', type: 'Guest', date: '2025-08-28', status: 'Checked Out', time: '10:30', purpose: 'Meeting' },
      { id: 3, name: 'Alice Johnson', type: 'Contractor', date: '2025-08-28', status: 'Checked In', time: '09:15', purpose: 'Maintenance' },
      { id: 4, name: 'Bob Lee', type: 'Guest', date: '2025-08-28', status: 'Checked In', time: '11:00', purpose: 'Interview' }
    ];
  }

  loadVisitorTypes() {
    this.visitorTypes = [
      { label: 'Building A', value: 60, color: '#3b82f6' },
      { label: 'Building B', value: 25, color: '#60a5fa' },
      { label: 'Building C', value: 15, color: '#93c5fd' }
    ];
  }
}
