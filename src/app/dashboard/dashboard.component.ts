import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardService } from '../service/dashboard.service';
import { ActivityLog, Metric } from '../models/dashboard.model'; 

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield'; 
import { InputIconModule } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';
import { TabViewModule } from 'primeng/tabview'; 
import { BadgeModule } from 'primeng/badge';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { TimelineModule } from 'primeng/timeline';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api'; 
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, DropdownModule, 
    CalendarModule, TableModule, TagModule, CheckboxModule, CardModule, 
    IconFieldModule, InputIconModule, AvatarModule, TabViewModule, BadgeModule, 
    SidebarModule, TooltipModule, TimelineModule, ConfirmDialogModule, ToastModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  // ✅ เอา DashboardService ออกจาก providers ป้องกันการสร้าง instance ซ้ำซ้อน
  providers: [ConfirmationService, MessageService] 
})
export class DashboardComponent implements OnInit {
  
  metrics: Metric[] = [];
  allActivities: ActivityLog[] = [];
  
  selectedLogs: any[] = [];
  selectedDate: Date | undefined;
  historyVisible: boolean = false;
  selectedUserHistory: ActivityLog[] = [];
  currentUser: string = '';

  constructor(private dashboardService: DashboardService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getMetrics().subscribe({
      next: (data: Metric[]) => this.metrics = data,
      error: (err: any) => console.error('Failed to load metrics', err)
    });

    this.dashboardService.getActivities().subscribe({
      next: (data: ActivityLog[]) => this.allActivities = data,
      error: (err: any) => console.error('Failed to load activities', err)
    });
  }

  get normalActivities() { 
    return this.allActivities.filter(a => a.category === 'normal'); 
  }
  
  get abnormalActivities() { 
    return this.allActivities.filter(a => a.category === 'abnormal'); 
  }

  // ✅ เพิ่ม Getter สำหรับดึงข้อมูล Data Revision / Admin Management
  get revisionActivities() {
    return this.allActivities.filter(a => a.log_type === 'Data Revision' || a.category === 'Admin Management');
  }

  viewUserHistory(userName: string) {
    this.currentUser = userName;
    this.selectedUserHistory = this.allActivities.filter(a => a.user === userName);
    this.historyVisible = true;
  }

  getActivityIcon(type: string): string {
    switch(type) {
        case 'Check-in': return 'pi pi-id-card';
        case 'Reservation': return 'pi pi-calendar-plus';
        case 'User Mgmt': return 'pi pi-user-edit';
        case 'Security': return 'pi pi-lock';
        case 'Login': return 'pi pi-desktop';
        case 'System': return 'pi pi-cog';
        case 'Access': return 'pi pi-ban';
        case 'Role Update': return 'pi pi-shield'; // ✅ เพิ่ม Icon โล่สำหรับเรื่องสิทธิ์
        default: return 'pi pi-info-circle';
    }
  }

  getStatusSeverity(status: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
    switch(status) {
        case 'success': return 'success';
        case 'warning': return 'warning';
        case 'denied': return 'danger';
        case 'error': return 'danger';
        default: return 'info';
    }
  }

  getActivitySeverity(category: string): "success" | "danger" | "info" | "warning" | "secondary" | "contrast" | undefined {
      // ✅ เพิ่มเงื่อนไขให้ Admin Management แสดงเป็น info (สีฟ้า) แทนที่จะเป็น danger
      if (category === 'Admin Management') return 'info';
      return category === 'normal' ? 'success' : 'danger';
  }
}