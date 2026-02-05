import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
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
import { TimelineModule } from 'primeng/timeline'; // ✅ Added for Activity View

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, DropdownModule, 
    CalendarModule, TableModule, TagModule, CheckboxModule, CardModule, 
    IconFieldModule, InputIconModule, AvatarModule, TabViewModule, BadgeModule, 
    SidebarModule, TooltipModule, TimelineModule // ✅ Add import
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  metrics = [
    { title: 'Total Logs', value: '4,852', subtext: 'Today', icon: 'pi pi-database', color: 'text-blue-600' },
    { title: 'Activities', value: '4,710', subtext: 'Events', icon: 'pi pi-id-card', color: 'text-green-600' },
    { title: 'Data Revisions', value: '142', subtext: 'Backend Changes', icon: 'pi pi-file-edit', color: 'text-orange-600' },
    { title: 'Alerts', value: '28', subtext: 'Require Action', icon: 'pi pi-bell', color: 'text-red-600' }
  ];

  // ✅ EXPANDED DATASET (Thai Language)
  allActivities = [
    // --- 06:00 - 08:00: การบำรุงรักษาระบบ & พนักงานเข้างานเช้า ---
    { 
      id: 1001, logType: 'revision', time: '06:00', type: 'System', action: 'UPDATE: สำรองข้อมูลรายวัน', user: 'ระบบอัตโนมัติ', 
      category: 'normal', status: 'success', entityId: 'SYS-BK-01', 
      changes: [{ field: 'สถานะ', old: 'กำลังทำงาน', new: 'เสร็จสมบูรณ์' }, { field: 'ขนาดไฟล์', old: '45GB', new: '45.2GB' }] 
    },
    { 
      id: 2001, logType: 'activity', time: '06:30', type: 'Check-in', action: 'เข้าประตูขนส่ง', user: 'แม่บ้านสมร', 
      category: 'normal', status: 'success', detail: 'ทางเข้าพนักงานบริการ', 
      meta: { location: 'ประตูหลัง', device: 'Keypad K-01', method: 'รหัสผ่าน', verification: 'ผ่าน' }
    },
    { 
      id: 1002, logType: 'revision', time: '07:00', type: 'System', action: 'UPDATE: กฎ Firewall', user: 'ระบบความปลอดภัย', 
      category: 'normal', status: 'success', entityId: 'NET-FW-05', 
      changes: [{ field: 'IP ที่ถูกบล็อก', old: '1042', new: '1055' }] 
    },
    { 
      id: 2002, logType: 'activity', time: '07:45', type: 'Parking', action: 'เข้าลานจอดรถ', user: 'ดร. วิชัย ใจดี', 
      category: 'normal', status: 'success', detail: 'ลานจอดบุคลากร A', 
      meta: { location: 'ประตูจอดรถ 1', device: 'กล้องอ่านป้าย (LPR)', method: 'ทะเบียนรถ', verification: '1กข-9999' }
    },

    // --- 08:00 - 09:00: ช่วงเช้า (นักศึกษา & การตั้งค่าระบบ) ---
    { 
      id: 1003, logType: 'revision', time: '08:00', type: 'User Mgmt', action: 'UPDATE: ระดับสิทธิ์', user: 'ผู้ดูแลระบบ', 
      category: 'normal', status: 'success', entityId: 'USER-001 (สมชาย)', 
      changes: [{ field: 'ระดับการเข้าถึง', old: 'ระดับ 1', new: 'ระดับ 2 (ห้องแล็บ)' }] 
    },
    { 
      id: 2003, logType: 'activity', time: '08:15', type: 'Check-in', action: 'เข้าห้องสมุด', user: 'สมชาย รักเรียน', 
      category: 'normal', status: 'success', detail: 'โถงกลางห้องสมุด', 
      meta: { location: 'ประตูห้องสมุด 1', device: 'ประตูหมุน T-01', method: 'บัตรนักศึกษา', verification: 'ผ่าน' }
    },
    { 
      id: 2004, logType: 'activity', time: '08:20', type: 'Access', action: 'ปฏิเสธการเข้าถึง', user: 'ศิษย์เก่า #445', 
      category: 'abnormal', status: 'denied', detail: 'พื้นที่ทำงานร่วม (Co-working)', 
      meta: { location: 'อาคาร 3', device: 'เครื่องอ่านบัตร R-20', method: 'บัตร NFC', verification: 'บัตรหมดอายุ' }
    },
    { 
      id: 1004, logType: 'revision', time: '08:30', type: 'Facility', action: 'UPDATE: ตั้งค่าห้อง', user: 'ผจก. อาคาร', 
      category: 'normal', status: 'success', entityId: 'ROOM-101', 
      changes: [{ field: 'ความจุ', old: '30', new: '40' }, { field: 'สถานะ', old: 'ซ่อมบำรุง', new: 'ใช้งานปกติ' }] 
    },
    { 
      id: 2005, logType: 'activity', time: '08:45', type: 'Login', action: 'เข้าสู่ระบบไม่สำเร็จ', user: 'ผู้ใช้ไม่ระบุตัวตน', 
      category: 'abnormal', status: 'warning', detail: 'เว็บพอร์ทัล', 
      meta: { location: 'IP: 45.33.22.11', device: 'เบราว์เซอร์ (Chrome)', method: 'รหัสผ่าน', verification: 'รหัสผิด' }
    },

    // --- 09:00 - 10:30: เวลาทำงาน & เหตุการณ์ต่างๆ ---
    { 
      id: 2006, logType: 'activity', time: '09:00', type: 'Reservation', action: 'สร้างการจอง', user: 'ดร. วิชัย ใจดี', 
      category: 'normal', status: 'success', detail: 'ห้องประชุม B', 
      meta: { location: 'แอปออนไลน์', device: 'iPhone 14', method: 'แอปพลิเคชัน', verification: 'ยืนยันแล้ว' }
    },
    { 
      id: 1005, logType: 'revision', time: '09:05', type: 'Reservation', action: 'UPDATE: รายละเอียดการจอง', user: 'ดร. วิชัย ใจดี', 
      category: 'normal', status: 'info', entityId: 'RES-9001', 
      changes: [{ field: 'หัวข้อประชุม', old: 'ประชุมทีม', new: 'เริ่มโครงการใหม่' }] 
    },
    { 
      id: 2007, logType: 'activity', time: '09:30', type: 'Access', action: 'ปฏิเสธการเข้าถึง', user: 'สมชาย รักเรียน', 
      category: 'abnormal', status: 'denied', detail: 'ห้องเซิร์ฟเวอร์', 
      meta: { location: 'ห้องเซิร์ฟเวอร์ B', device: 'สแกนชีวภาพ', method: 'ลายนิ้วมือ', verification: 'ไม่มีสิทธิ์' }
    },
    { 
      id: 2008, logType: 'activity', time: '10:00', type: 'Security', action: 'ประตูถูกงัดแงะ', user: 'ไม่ระบุ', 
      category: 'abnormal', status: 'error', detail: 'หนีไฟชั้น 5', 
      meta: { location: 'อาคาร 1 - ชั้น 5', device: 'เซนเซอร์ D-55', method: 'ใช้กำลังเปิด', verification: 'สัญญาณเตือนทำงาน' }
    },
    { 
      id: 1006, logType: 'revision', time: '10:05', type: 'Security', action: 'UPDATE: บันทึกเหตุการณ์', user: 'หัวหน้า รปภ.', 
      category: 'abnormal', status: 'warning', entityId: 'INC-2024-005', 
      changes: [{ field: 'สถานะ', old: 'เปิด', new: 'กำลังตรวจสอบ' }, { field: 'ความรุนแรง', old: 'ต่ำ', new: 'สูง' }] 
    },

    // --- 10:30 - 12:00: แจ้งเตือน IoT & พักเที่ยง ---
    { 
      id: 2009, logType: 'activity', time: '10:45', type: 'System', action: 'แจ้งเตือนอุณหภูมิสูง', user: 'เซนเซอร์ IoT', 
      category: 'abnormal', status: 'warning', detail: 'ตู้เซิร์ฟเวอร์ 4', 
      meta: { location: 'ศูนย์ข้อมูล', device: 'วัดอุณหภูมิ', method: 'อัตโนมัติ', verification: '35°C (เกินค่า 30°C)' }
    },
    { 
      id: 1007, logType: 'revision', time: '11:00', type: 'System', action: 'UPDATE: ระบบระบายความร้อน', user: 'ระบบปรับอัตโนมัติ', 
      category: 'normal', status: 'success', entityId: 'IOT-COOLING', 
      changes: [{ field: 'ความเร็วพัดลม', old: '40%', new: '85%' }] 
    },
    { 
      id: 2010, logType: 'activity', time: '11:30', type: 'Check-in', action: 'เข้าโรงอาหาร', user: 'สมชาย รักเรียน', 
      category: 'normal', status: 'success', detail: 'ศูนย์อาหาร', 
      meta: { location: 'โรงอาหารโซน A', device: 'ประตูหมุน C-02', method: 'สแกนใบหน้า', verification: 'ผ่าน' }
    },
    { 
      id: 1008, logType: 'revision', time: '11:45', type: 'User Mgmt', action: 'RESET: รหัสผ่าน', user: 'ผู้ดูแลระบบ', 
      category: 'normal', status: 'success', entityId: 'USER-055 (มานี)', 
      changes: [{ field: 'ตั้งรหัสล่าสุด', old: '01/01/2566', new: 'วันนี้' }] 
    },
    { 
      id: 2011, logType: 'activity', time: '12:00', type: 'Check-out', action: 'ออกจากอาคาร', user: 'ดร. วิชัย ใจดี', 
      category: 'normal', status: 'success', detail: 'ทางออกหลัก', 
      meta: { location: 'ประตู 1', device: 'เครื่องอ่าน RFID', method: 'บัตรพนักงาน', verification: 'บันทึกแล้ว' }
    }
  ];

  selectedLogs: any[] = [];
  selectedDate: Date | undefined;
  historyVisible: boolean = false;
  selectedUserHistory: any[] = [];
  currentUser: string = '';

  ngOnInit(): void {}

  get normalActivities() { return this.allActivities.filter(a => a.category === 'normal'); }
  get abnormalActivities() { return this.allActivities.filter(a => a.category === 'abnormal'); }

  viewUserHistory(userName: string) {
    this.currentUser = userName;
    this.selectedUserHistory = this.allActivities.filter(a => a.user === userName);
    this.historyVisible = true;
  }

  // Helpers
  getActivityIcon(type: string): string {
    switch(type) {
        case 'Check-in': return 'pi pi-id-card';
        case 'Reservation': return 'pi pi-calendar-plus';
        case 'User Mgmt': return 'pi pi-user-edit';
        case 'Security': return 'pi pi-lock';
        case 'Login': return 'pi pi-desktop';
        case 'System': return 'pi pi-cog';
        case 'Access': return 'pi pi-ban';
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
      return category === 'normal' ? 'success' : 'danger';
  }
}