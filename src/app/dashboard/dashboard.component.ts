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
  providers: [ConfirmationService, MessageService] 
})
export class DashboardComponent implements OnInit {
  
  metrics: any[] = []; // ✅ เปลี่ยนเป็น any[] เพื่อให้รับ icon ได้ง่ายๆ
  allActivities: ActivityLog[] = [];
  
  selectedLogs: any[] = [];
  selectedDate: Date | undefined;
  historyVisible: boolean = false;
  selectedUserHistory: ActivityLog[] = [];
  currentUser: string = '';

  constructor(
    private dashboardService: DashboardService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getActivities().subscribe({
      next: (data: ActivityLog[]) => {
        this.allActivities = data || [];
        this.calculateRealtimeMetrics(); // ✅ สั่งให้นับตัวเลขจากข้อมูลจริง!
      },
      error: (err: any) => console.error('Failed to load activities', err)
    });
  }

  // ✅ ฟังก์ชันนี้นับจำนวนจากตารางเป๊ะๆ แน่นอน 100%
  calculateRealtimeMetrics() {
    this.metrics = [
      { title: 'กิจกรรมทั้งหมด', value: this.allActivities.length.toString(), subtext: 'Total Logs', icon: 'pi pi-history', color: 'text-blue-500', bg: 'bg-blue-50' },
      { title: 'ปกติ (Normal)', value: this.normalActivities.length.toString(), subtext: 'System Normal', icon: 'pi pi-check-circle', color: 'text-green-500', bg: 'bg-green-50' },
      { title: 'สิ่งที่ต้องตรวจสอบ', value: this.abnormalActivities.length.toString(), subtext: 'Needs Attention', icon: 'pi pi-exclamation-triangle', color: 'text-red-500', bg: 'bg-red-50' },
      { title: 'การจัดการระบบ', value: this.revisionActivities.length.toString(), subtext: 'Data Revisions', icon: 'pi pi-database', color: 'text-purple-500', bg: 'bg-purple-50' }
    ];
  }

  get normalActivities() { 
    return this.allActivities.filter(a => a.category === 'normal'); 
  }
  
  get abnormalActivities() { 
    return this.allActivities.filter(a => a.category === 'abnormal'); 
  }

  get revisionActivities() {
    return this.allActivities.filter(a => 
      a.log_type === 'Data Revision' || 
      a.logType === 'revision' || 
      a.category === 'Admin Management'
    );
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
        case 'Role Update': return 'pi pi-shield';
        default: return 'pi pi-info-circle';
    }
  }

  getStatusSeverity(status: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
    switch(status?.toLowerCase()) {
        case 'success': return 'success';
        case 'warning': return 'warning';
        case 'denied': 
        case 'error': return 'danger';
        default: return 'info';
    }
  }
}