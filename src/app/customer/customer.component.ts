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
import {DialogModule} from 'primeng/dialog';

import { UserService } from '../service/user.service'; 
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule, 
    TableModule, ButtonModule, CardModule, DropdownModule, 
    CalendarModule, InputTextModule, IconFieldModule, InputIconModule, 
    AvatarModule, TagModule, TooltipModule, BadgeModule,
    ConfirmDialogModule, ToastModule , DialogModule
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
        if (res) { 
          
          this.metrics = (res.metrics || []).map((m: any) => {
            let icon = 'pi pi-users';
            if (m.title === 'ผู้ดูแลระบบ') icon = 'pi pi-shield text-red-500';
            if (m.title === 'ผู้ใช้งานทั่วไป') icon = 'pi pi-user text-blue-500';
            return { ...m, icon };
          });

          this.users = (res.profiles || []).map((p: any) => {
            let cat = 'External';
            const roleLower = (p.role || '').toLowerCase();
            
            if (roleLower.includes('admin') || roleLower === 'host') cat = 'Admin Management';
            else if (roleLower === 'staff' || roleLower === 'employee') cat = 'Internal';
            else if (roleLower === 'partner' || roleLower === 'hybrid tech') cat = 'Hybrid';

            return {
              id: p.id,
              // 🚀 รวม first_name, last_name เป็น name หรือ fallback ด้วย email ถ้าเพื่อนไม่มีข้อมูล
              name: p.name || p.email || 'Unknown User', 
              email: p.email,
              phone: p.phone || '-',
              role: p.role || 'User',
              category: cat,
              company: p.company || '-', // DB เพื่อนไม่มี company ใส่ - ไว้ก่อน
              authMethod: p.line_id ? 'LINE OA' : 'Email', // ถ้ามี line_id ตีความว่าล็อกอินผ่านไลน์
              registerDate: p.created_at || p.joined_date, // 🚀 ใช้ created_at
              expiryDate: null, 
              status: p.status || 'Active', 
              avatar: p.avatar,
              _raw: p 
            };
          });

          this.applyFilters(); 
        }
      },
      error: (err: any) => {
        console.error('Failed to load users:', err);
        this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถโหลดข้อมูลผู้ใช้งานได้' });
      }
    });
  }

  setCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters() {
    if (this.selectedCategory === 'All') {
      this.filteredUsers = [...this.users];
    } else if (this.selectedCategory === 'Admin Management') {
      this.filteredUsers = this.users.filter(user => {
        const r = (user.role || '').toLowerCase();
        return r.includes('admin') || r === 'host';
      });
    } else {
      this.filteredUsers = this.users.filter(user => user.category === this.selectedCategory);
    }
  }

  getCount(category: string): number {
    if (category === 'All') return this.users.length;
    return this.users.filter(u => u.category === category).length;
  }

  getAdminCount(): number {
    return this.users.filter(user => {
      const r = (user.role || '').toLowerCase();
      return r.includes('admin') || r === 'host';
    }).length;
  }

  getRoleSeverity(role: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
    const r = (role || '').toLowerCase();
    if (r.includes('admin') || r === 'host') return 'primary' as any;
    if (r === 'security') return 'contrast';
    if (r === 'staff' || r === 'employee') return 'info';
    if (r === 'hybrid tech' || r === 'partner') return undefined; 
    if (r === 'technician' || r === 'contractor') return 'warning';
    if (r === 'messenger') return 'secondary';
    if (r === 'guest') return 'success';
    return 'secondary';
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
    if (m.includes('magic') || m.includes('email')) return 'Email';
    return method; 
  }

  getStatusColor(status: string): string {
    switch(status?.toLowerCase()) {
        case 'active': return 'text-green-600 font-bold';
        case 'checked in': return 'text-blue-600 font-bold';
        case 'checked out': return 'text-gray-500';
        case 'pending': return 'text-orange-500 font-bold';
        case 'blacklist': return 'text-red-600 font-bold line-through';
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

  toggleBlacklist(user: any) {
    const isCurrentlyBlacklisted = user.status === 'Blacklist';
    const newStatus = isCurrentlyBlacklisted ? 'Active' : 'Blacklist';
    const actionText = isCurrentlyBlacklisted ? 'ปลดแบล็คลิสต์' : 'แบล็คลิสต์';
    const iconClass = isCurrentlyBlacklisted ? 'pi pi-check-circle text-green-500' : 'pi pi-ban text-red-500';
    const buttonClass = isCurrentlyBlacklisted ? 'p-button-success' : 'p-button-danger';

    this.confirmationService.confirm({
      message: `คุณแน่ใจหรือไม่ที่จะ <b>${actionText}</b> ผู้ใช้งาน <b>${user.name}</b> ?`,
      header: `ยืนยันการ${actionText}`,
      icon: iconClass,
      acceptLabel: 'ยืนยัน',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: buttonClass,
      rejectButtonStyleClass: "p-button-text p-button-secondary",
      accept: () => {
        this.userService.updateUserStatus(user.id, newStatus).subscribe({
          next: () => {
            user.status = newStatus;
            if (newStatus === 'Blacklist') user.category = 'Blacklist'; 
            this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: `ดำเนินการ${actionText}เรียบร้อยแล้ว` });
            this.applyFilters();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'โปรดเพิ่มคอลัมน์ status ในตาราง profiles ของฐานข้อมูลเพื่อน' });
          }
        });
      }
    });
  }

  confirmPromote(user: any) {
    this.confirmationService.confirm({
      message: `คุณแน่ใจหรือไม่ที่จะเลื่อนขั้น <b>${user.name}</b> เป็น Admin?`,
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
      message: `คุณแน่ใจหรือไม่ที่จะลดขั้น <b>${user.name}</b> กลับเป็น User ปกติ?`,
      header: 'ยืนยันการลดขั้น (Demote)',
      icon: 'pi pi-arrow-down text-red-500',
      acceptLabel: 'ยืนยันการลดขั้น',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => { this.updateUserRole(user, 'User'); }
    });
  }

  updateUserRole(user: any, newRole: string) {
    this.userService.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole; 
        if (newRole === 'Admin') user.category = 'Admin Management';
        else if (newRole === 'User' || newRole === 'Staff') user.category = 'Internal';
        
        this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: `เปลี่ยนบทบาทเป็น ${newRole} เรียบร้อยแล้ว` });
        this.applyFilters(); 
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถเปลี่ยนสิทธิ์ได้' });
      }
    });
  }

  // --- ตัวแปรใหม่สำหรับ Modal คำเชิญ ---
  displayInviteModal: boolean = false;
  inviteForm = { email: '', name: '', role: 'User' };
  roleOptions = [
    { label: 'ผู้ใช้งานทั่วไป (User)', value: 'User' },
    { label: 'พนักงาน (Staff)', value: 'Staff' },
    { label: 'ผู้ดูแลระบบ (Admin)', value: 'Admin' }
  ];

  openInviteModal() {
    this.inviteForm = { email: '', name: '', role: 'User' };
    this.displayInviteModal = true;
  }

  sendInvite() {
    if (!this.inviteForm.email || !this.inviteForm.name) {
      this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'กรุณากรอกชื่อและอีเมลให้ครบถ้วน' });
      return;
    }

    this.userService.inviteUser(this.inviteForm).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: res.message });
        this.displayInviteModal = false;
        this.loadUsers(); // โหลดตารางใหม่
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถส่งคำเชิญได้ โปรดตรวจสอบอีเมล' });
      }
    });
  }
  

}