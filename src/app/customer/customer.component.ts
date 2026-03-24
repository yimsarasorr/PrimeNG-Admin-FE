import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { UserService } from '../service/user.service'; 

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule, 
    TableModule, ButtonModule, CardModule, DropdownModule, 
    CalendarModule, InputTextModule, IconFieldModule, InputIconModule, 
    AvatarModule, TagModule, TooltipModule, BadgeModule,
    ConfirmDialogModule, ToastModule 
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './customer.component.html',
  styles: [`
    .overflow-x-auto::-webkit-scrollbar { display: none; }
    .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class CustomerComponent implements OnInit {
  
  selectedCategory: string = 'All';
  selectedUsers: any[] = []; 
  
  // ✅ ประกาศตัวแปรแค่ครั้งเดียวเท่านั้น!
  users: any[] = [];
  filteredUsers: any[] = [];
  metrics: any[] = [];

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }


  loadUsers() {
    this.userService.getProfiles().subscribe({
      next: (res: any) => { 
        // ✅ ไม่ต้องเช็ค res.success แล้ว แค่มีข้อมูล res ส่งมาก็พอ
        if (res) { 
          
          // 1️⃣ จัดการ Metrics
          this.metrics = (res.metrics || []).map((m: any) => {
            let icon = 'pi pi-users';
            if (m.title === 'ผู้ดูแลระบบ') icon = 'pi pi-shield text-red-500';
            if (m.title === 'ผู้ใช้งานทั่วไป') icon = 'pi pi-user text-blue-500';
            return { ...m, icon };
          });

          // 2️⃣ จัดการ Profiles เข้าตาราง
          this.users = (res.profiles || []).map((p: any) => {
            let cat = 'External';
            if (p.role === 'Admin' || p.role === 'Super Admin') cat = 'Admin Management';
            else if (p.role === 'Staff' || p.role === 'Employee') cat = 'Internal';
            else if (p.role === 'Partner' || p.role === 'Hybrid Tech') cat = 'Hybrid';

            return {
              id: p.id,
              firstName: p.name || '-', 
              lastName: '',
              email: p.email,
              phone: p.phone || '-',
              role: p.role || 'Guest',
              category: cat,
              company: '-', 
              authMethod: 'Email', 
              registerDate: p.joined_date, 
              expiryDate: null, 
              status: p.status || 'Active', // ✅ ใช้สถานะจาก DB
              avatar: p.avatar,
              _raw: p 
            };
          });

          this.applyFilters(); // อัปเดตตารางให้แสดงผล

        }
      },
      error: (err: any) => {
        console.error('Failed to load users:', err);
        this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถโหลดข้อมูลผู้ใช้งานได้' });
      }
    });
  }

  // ✅ ระบบ Filter 
  setCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters() {
    if (this.selectedCategory === 'All') {
      this.filteredUsers = [...this.users];
    } else if (this.selectedCategory === 'Admin Management') {
      this.filteredUsers = this.users.filter(user => user.role === 'Admin' || user.role === 'Super Admin');
    } else {
      this.filteredUsers = this.users.filter(user => user.category === this.selectedCategory);
    }
  }

  // ✅ ฟังก์ชันคำนวณตัวเลข (มีแค่ที่เดียว)
  getCount(category: string): number {
    if (category === 'All') return this.users.length;
    return this.users.filter(u => u.category === category).length;
  }

  getAdminCount(): number {
    return this.users.filter(u => u.role === 'Admin' || u.role === 'Super Admin').length;
  }

  // =====================================
  // ส่วน UI Helpers (ไอคอน, สีสถานะ ฯลฯ)
  // =====================================
  getRoleSeverity(role: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
    switch (role) {
      case 'Super Admin': 
      case 'Admin': return 'primary' as any;
      case 'Security': return 'contrast';
      case 'Staff':
      case 'Employee': return 'info';
      case 'Hybrid Tech': 
      case 'Partner': return undefined; 
      case 'Technician': 
      case 'Contractor': return 'warning';
      case 'Messenger': return 'secondary';
      case 'Guest': return 'success';
      default: return 'secondary';
    }
  }

  getAuthIcon(method: string | null): string {
    if (!method || method.toLowerCase() === 'guest') return 'pi pi-user text-gray-400';
    const m = method.toLowerCase();
    if (m.includes('line')) return 'pi pi-comments text-green-500'; 
    if (m.includes('magic') || m.includes('email')) return 'pi pi-envelope text-blue-500'; 
    if (m.includes('kiosk')) return 'pi pi-desktop text-purple-500';
    if (m.includes('face')) return 'pi pi-face-smile text-orange-500';
    return 'pi pi-id-card text-gray-500';
  }

  getAuthText(method: string | null): string {
    if (!method || method.toLowerCase() === 'guest') return 'Guest User';
    const m = method.toLowerCase();
    if (m.includes('line')) return 'LINE OA';
    if (m.includes('magic') || m.includes('email')) return 'Magic Link';
    return method; 
  }

  getStatusColor(status: string): string {
    switch(status) {
        case 'Active': return 'text-green-600 font-bold';
        case 'Checked In': return 'text-blue-600 font-bold';
        case 'Checked Out': return 'text-gray-500';
        case 'Pending': return 'text-orange-500 font-bold';
        case 'Blacklist': return 'text-red-600 font-bold line-through';
        default: return 'text-gray-700';
    }
  }

  isExpired(dateString: string | null): boolean {
    if (!dateString) return false;
    const exp = new Date(dateString);
    const today = new Date();
    today.setHours(0,0,0,0);
    return exp < today;
  }

  // =====================================
  // ระบบจัดการ (Ban, Promote, Demote)
  // =====================================
  toggleBlacklist(user: any) {
    const isCurrentlyBlacklisted = user.status === 'Blacklist';
    const newStatus = isCurrentlyBlacklisted ? 'Active' : 'Blacklist';
    const actionText = isCurrentlyBlacklisted ? 'ปลดแบล็คลิสต์' : 'แบล็คลิสต์';
    const iconClass = isCurrentlyBlacklisted ? 'pi pi-check-circle text-green-500' : 'pi pi-ban text-red-500';
    const buttonClass = isCurrentlyBlacklisted ? 'p-button-success' : 'p-button-danger';

    this.confirmationService.confirm({
      message: `คุณแน่ใจหรือไม่ที่จะ <b>${actionText}</b> ผู้ใช้งาน <b>${user.firstName || user.email}</b> ?`,
      header: `ยืนยันการ${actionText}`,
      icon: iconClass,
      acceptLabel: 'ยืนยัน',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: buttonClass,
      rejectButtonStyleClass: "p-button-text p-button-secondary",
      accept: () => {
        user.status = newStatus;
        if (newStatus === 'Blacklist') user.category = 'Blacklist'; 
        
        this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: `ดำเนินการ${actionText}เรียบร้อยแล้ว` });
        this.applyFilters();
      }
    });
  }

  confirmPromote(user: any) {
    this.confirmationService.confirm({
      message: `คุณแน่ใจหรือไม่ที่จะเลื่อนขั้น <b>${user.firstName}</b> เป็น Admin?`,
      header: 'ยืนยันการเลื่อนขั้น (Promote)',
      icon: 'pi pi-arrow-up text-green-500',
      acceptLabel: 'ยืนยันการเลื่อนขั้น',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => { this.updateUserRole(user, 'Admin'); }
    });
  }

  confirmDemote(user: any) {
    this.confirmationService.confirm({
      message: `คุณแน่ใจหรือไม่ที่จะลดขั้น <b>${user.firstName}</b> กลับเป็น User ปกติ?`,
      header: 'ยืนยันการลดขั้น (Demote)',
      icon: 'pi pi-arrow-down text-red-500',
      acceptLabel: 'ยืนยันการลดขั้น',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => { this.updateUserRole(user, 'Staff'); }
    });
  }

  updateUserRole(user: any, newRole: string) {
    user.role = newRole; 
    
    if (newRole === 'Admin') user.category = 'Admin Management';
    else if (newRole === 'Staff') user.category = 'Internal';
    
    this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: `เปลี่ยนบทบาทเป็น ${newRole} เรียบร้อยแล้ว` });
    this.applyFilters(); 
  }
}