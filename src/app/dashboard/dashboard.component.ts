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
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
               'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          type: 'bar',
          label: 'Employees',
          backgroundColor: '#3b82f6',
          data: [120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230],
          barPercentage: 1.0,          // ✅ เต็ม category
          categoryPercentage: 0.4,     // ✅ ลดช่องว่าง
          maxBarThickness: 40          // ✅ จำกัดความหนาแท่ง
        },
        {
          type: 'bar',
          label: 'Guests',
          backgroundColor: '#60a5fa',
          data: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190],
          barPercentage: 1.0,
          categoryPercentage: 0.4,
          maxBarThickness: 40
        },
        {
          type: 'bar',
          label: 'Contractors',
          backgroundColor: '#93c5fd',
          data: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 100],
          barPercentage: 1.0,
          categoryPercentage: 0.4,
          maxBarThickness: 40
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#1e293b', font: { size: 14, weight: 'bold' } }
        },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { size: 13 } },
          grid: { color: '#f3f4f6' },
          stacked: false
        },
        y: {
          ticks: { color: '#64748b', font: { size: 12 } },
          grid: { color: '#f3f4f6' },
          beginAtZero: true
        }
      }
    };
  }

  loadVisitorLogs() {
    this.visitorLogs = [...this.visitorLogs];
  }

  loadVisitorTypes() {
    this.visitorTypes = [...this.visitorTypes];
  }
}
