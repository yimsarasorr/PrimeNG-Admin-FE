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
  
  metrics: any[] = []; 
  allActivities: any[] = []; // ใช้ any ชั่วคราวเพื่อให้ยืดหยุ่นรับข้อมูลที่มาจาก DB
  
  selectedLogs: any[] = [];
  selectedDate: Date | undefined;
  historyVisible: boolean = false;
  selectedUserHistory: any[] = [];
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
      next: (data: any[]) => {
        this.allActivities = data || [];
        this.calculateRealtimeMetrics();
      },
      error: (err: any) => console.error('Failed to load activities', err)
    });
  }

  calculateRealtimeMetrics() {
    this.metrics = [
      { title: 'กิจกรรมทั้งหมด', value: this.allActivities.length.toString(), subtext: 'Total Logs', icon: 'pi pi-history', color: 'text-blue-500', bg: 'bg-blue-50' },
      { title: 'ปกติ (Normal)', value: this.normalActivities.length.toString(), subtext: 'System Normal', icon: 'pi pi-check-circle', color: 'text-green-500', bg: 'bg-green-50' },
      { title: 'สิ่งที่ต้องตรวจสอบ', value: this.abnormalActivities.length.toString(), subtext: 'Needs Attention', icon: 'pi pi-exclamation-triangle', color: 'text-red-500', bg: 'bg-red-50' },
      { title: 'การจัดการระบบ', value: this.revisionActivities.length.toString(), subtext: 'Admin Actions', icon: 'pi pi-database', color: 'text-purple-500', bg: 'bg-purple-50' }
    ];
  }

  // 🚀 Re-aligned Categories: จัดระเบียบการแยกแท็บใหม่ให้ Make Sense

  // 1. แท็บ "ปกติ": รวมกิจกรรมทั่วไปของ User เช่น ล็อกอิน, เข้าประตูผ่าน, สร้างการจอง
  get normalActivities() { 
    return this.allActivities.filter(a => {
      // ตรวจสอบจาก Category หรือ Status
      if (a.category === 'normal' || a.category === 'Access Control' || a.log_type === 'Authentication') {
        // ถ้าเป็นการเข้าประตู ต้องเป็น Access Granted หรือ Success ถึงจะถือว่าปกติ
        if (a.status === 'Denied' || a.status === 'Error' || a.action === 'Access Denied') {
          return false;
        }
        return true;
      }
      return false;
    }); 
  }
  
  // 2. แท็บ "ตรวจสอบ": กิจกรรมที่ผิดพลาด, ปฏิเสธการเข้า, แจ้งเตือนระบบ
  get abnormalActivities() { 
    return this.allActivities.filter(a => 
      a.category === 'abnormal' || 
      a.status === 'Denied' || 
      a.status === 'Error' || 
      a.status === 'danger' ||
      a.action === 'Access Denied'
    ); 
  }

  // 3. แท็บ "จัดการระบบ": รวมสิ่งที่ Admin เป็นคนทำ (แก้ข้อมูล, เปลี่ยนสิทธิ์, ตั้งค่าตึก)
  get revisionActivities() {
    return this.allActivities.filter(a => 
      a.log_type === 'Data Revision' || 
      a.logType === 'revision' || 
      a.category === 'Admin Management' ||
      a.action?.toLowerCase().includes('update') ||
      a.action?.toLowerCase().includes('delete') ||
      a.action?.toLowerCase().includes('created building')
    );
  }

  viewUserHistory(userName: string) {
    // ถ้าไม่มีชื่อ ให้ดึงจาก entity_id หรือ user_id แทน
    this.currentUser = userName || 'Unknown User'; 
    this.selectedUserHistory = this.allActivities.filter(a => a.user === userName);
    this.historyVisible = true;
  }

  // 🚀 จัด Icon ใหม่ให้สอดคล้องกับประเภทข้อมูลมากขึ้น
  getActivityIcon(type: string): string {
    const t = type?.toLowerCase() || '';
    if (t.includes('check-in')) return 'pi pi-id-card';
    if (t.includes('reservation') || t.includes('ticket')) return 'pi pi-ticket';
    if (t.includes('user mgmt') || t.includes('role')) return 'pi pi-user-edit';
    if (t.includes('security') || t.includes('door') || t.includes('access')) return 'pi pi-key';
    if (t.includes('login') || t.includes('auth')) return 'pi pi-sign-in';
    if (t.includes('system') || t.includes('setting')) return 'pi pi-cog';
    if (t.includes('building') || t.includes('floor') || t.includes('room')) return 'pi pi-building';
    return 'pi pi-info-circle';
  }

  // 🚀 ปรับสี Status ให้ฉลาดขึ้น
  getStatusSeverity(status: string, action?: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
    const s = status?.toLowerCase() || '';
    const act = action?.toLowerCase() || '';
    
    if (act.includes('denied') || act.includes('fail')) return 'danger';
    if (s === 'success' || s === 'granted' || s === 'active') return 'success';
    if (s === 'warning' || s === 'pending') return 'warning';
    if (s === 'denied' || s === 'error' || s === 'inactive') return 'danger';
    
    return 'info';
  }

  // ฟังก์ชันช่วยจัดรูปแบบข้อความ Meta ให้อ่านง่ายขึ้น (ใช้ในหน้า HTML)
  formatMetaDetail(metaString: string): string {
    if (!metaString) return '';
    try {
      const meta = JSON.parse(metaString);
      let details = [];
      if (meta.door_id) details.push(`ประตู: ${meta.door_id}`);
      if (meta.is_granted !== undefined) details.push(`สิทธิ์: ${meta.is_granted ? 'อนุญาต' : 'ไม่อนุญาต'}`);
      if (meta.location) details.push(`สถานที่: ${meta.location}`);
      return details.join(' | ') || metaString;
    } catch (e) {
      return metaString;
    }
  }
}