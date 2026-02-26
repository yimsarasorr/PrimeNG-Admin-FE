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

// ✅ Import โมดูลสำหรับ Dialog และ Toast
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { UserService, User } from '../service/user.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule, 
    TableModule, ButtonModule, CardModule, DropdownModule, 
    CalendarModule, InputTextModule, IconFieldModule, InputIconModule, 
    AvatarModule, TagModule, TooltipModule, BadgeModule,
    
    // ✅ นำเข้า Module ให้ Component รู้จัก
    ConfirmDialogModule, ToastModule 
  ],
  // ✅ ต้องใส่ Providers ตรงนี้เสมอ เพื่อให้ Service ของ Modal สร้างขึ้นมาทำงานได้
  providers: [ConfirmationService, MessageService],
  templateUrl: './customer.component.html',
  styles: [`
    .overflow-x-auto::-webkit-scrollbar { display: none; }
    .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class CustomerComponent implements OnInit {
  selectedCategory: string = 'All';
  selectedUsers: User[] = [];
  selectedDate: Date | undefined;
  allUsers: User[] = [];

  metrics = [
    { title: 'ผู้ใช้งานทั้งหมด', value: '...', subtext: 'Loading...', icon: 'pi pi-users' },
    { title: 'กำลังปฏิบัติงาน', value: '...', subtext: 'On-site Now', icon: 'pi pi-building' },
    { title: 'ผู้มาติดต่อ (Visitor)', value: '...', subtext: 'Logged Today', icon: 'pi pi-id-card' },
    { title: 'แจ้งเตือนหมดอายุ', value: '...', subtext: 'Expired Access', icon: 'pi pi-exclamation-triangle' }
  ];

  roleOptions = [
    { label: 'Role ทั้งหมด', value: null },
    { label: 'Super Admin', value: 'Super Admin' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Staff (พนักงาน)', value: 'Employee' },
    { label: 'Hybrid Tech (ช่างประจำ)', value: 'Hybrid Tech' },
    { label: 'Consultant (ที่ปรึกษา)', value: 'Consultant' },
    { label: 'Security (รปภ.)', value: 'Security' },
    { label: 'Technician (ช่างรายครั้ง)', value: 'Technician' },
    { label: 'Guest', value: 'Guest' }
  ];

  authOptions = [
    { label: 'ช่องทางทั้งหมด', value: null },
    { label: 'App / Line OA', value: 'Line OA' },
    { label: 'Kiosk (Walk-in)', value: 'Kiosk' },
    { label: 'Face Scan', value: 'Face Scan' },
    { label: 'แลกบัตร (ID Card)', value: 'ID Exchange' }
  ];

  statusOptions = [
    { label: 'สถานะ', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Checked In', value: 'Checked In' },
    { label: 'Checked Out', value: 'Checked Out' },
    { label: 'Blacklist', value: 'Blacklist' }
  ];

  // ✅ Inject Service เข้ามาเพื่อเรียกใช้งาน
  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.calculateMetrics(data); 
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  calculateMetrics(data: User[]) {
    const total = data.length;
    const onSite = data.filter(u => u.status === 'Checked In').length;
    const visitors = data.filter(u => u.category === 'External').length;
    const expired = data.filter(u => this.isExpired(u.expiryDate ?? null)).length;

    this.metrics = [
      { title: 'ผู้ใช้งานทั้งหมด', value: total.toLocaleString(), subtext: 'Total Users', icon: 'pi pi-users' },
      { title: 'กำลังปฏิบัติงาน', value: onSite.toLocaleString(), subtext: 'On-site Now', icon: 'pi pi-building' },
      { title: 'ผู้มาติดต่อ (Visitor)', value: visitors.toLocaleString(), subtext: 'Logged Today', icon: 'pi pi-id-card' },
      { title: 'แจ้งเตือนหมดอายุ', value: expired.toString(), subtext: 'Expired Access', icon: 'pi pi-exclamation-triangle' }
    ];
  }

  get filteredUsers() {
    if (this.selectedCategory === 'All') return this.allUsers;
    if (this.selectedCategory === 'Admin Management') {
        return this.allUsers.filter(user => user.role === 'Admin' || user.role === 'Super Admin');
    }
    return this.allUsers.filter(user => user.category === this.selectedCategory);
  }

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  getCount(category: string): number {
    if (category === 'All') return this.allUsers.length;
    return this.allUsers.filter(u => u.category === category).length;
  }

  getAdminCount(): number {
      return this.allUsers.filter(u => u.role === 'Admin' || u.role === 'Super Admin').length;
  }

  // ✅ ฟังก์ชันสลับ Role แบบเด้ง Modal ยืนยัน และยิง API ไป Backend
  changeAdminRole(user: User, newRole: string) {
    this.confirmationService.confirm({
      message: `คุณแน่ใจหรือไม่ที่จะเปลี่ยนสิทธิ์ของ <b>${user.first_name || user.email || 'ผู้ใช้นี้'}</b> เป็น <b class="text-primary">${newRole}</b> ?`,
      header: 'ยืนยันการเปลี่ยนแปลงสิทธิ์',
      icon: 'pi pi-exclamation-triangle text-yellow-500',
      acceptLabel: 'ยืนยัน',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: "p-button-success",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        // เมื่อ User กดยืนยัน -> สั่ง UserService ยิง API ไปแก้ไข Database
        // (ต้องมั่นใจว่าใน user.service.ts มีฟังก์ชัน updateUserRole แล้วนะครับ)
        this.userService.updateUserRole(user.id, newRole).subscribe({
          next: () => {
            // สำเร็จ! เปลี่ยนสิทธิ์บนหน้าจอทันที
            user.role = newRole; 
            
            // โชว์แจ้งเตือนเด้งมุมขวา
            this.messageService.add({ 
              severity: 'success', 
              summary: 'สำเร็จ', 
              detail: `อัปเดตสิทธิ์เป็น ${newRole} เรียบร้อยแล้ว` 
            });
          },
          error: (err) => {
            console.error('Error updating role:', err);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'ผิดพลาด', 
              detail: 'ไม่สามารถอัปเดตสิทธิ์ได้' 
            });
          }
        });
      }
    });
  }

  getRoleSeverity(role: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
    switch (role) {
      case 'Super Admin': 
      case 'Admin': return 'primary' as any;
      case 'Security': return 'contrast';
      case 'Employee': return 'info';
      case 'Hybrid Tech': 
      case 'Consultant': return undefined; 
      case 'Technician': 
      case 'Contractor': return 'warning';
      case 'Messenger': return 'secondary';
      case 'Guest': return 'success';
      default: return 'secondary';
    }
  }

  getAuthIcon(method: string | null): string {
    if (!method) return 'pi pi-question';
    if (method.includes('Kiosk')) return 'pi pi-desktop';
    if (method.includes('Line OA') || method === 'System' || method.includes('App')) return 'pi pi-mobile';
    if (method === 'Face Scan') return 'pi pi-face-smile';
    if (method.includes('ID Exchange') || method.includes('Card')) return 'pi pi-id-card';
    return 'pi pi-cog';
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
}