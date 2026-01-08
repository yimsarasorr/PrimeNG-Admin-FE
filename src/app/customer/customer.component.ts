import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { ModalService } from '../service/modal.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    CardModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {
  // Metrics for User Management
  metrics = [
    { title: 'บัญชีผู้ใช้งานทั้งหมด', value: '1,247', subtext: '+2 บัญชี', icon: 'pi pi-users', isTime: false },
    { title: 'บัญชีผู้เยี่ยมชม', value: '892', subtext: '+1 บัญชี', icon: 'pi pi-user', isTime: false },
    { title: 'บัญชีพนักงาน', value: '267', subtext: '', icon: 'pi pi-shopping-bag', isTime: false },
    { title: 'บัญชีเจ้าหน้าที่', value: '88', subtext: '+1 บัญชีใหม่', icon: 'pi pi-briefcase', isTime: false }
  ];

  // Table Data mapping the screenshot rows
  users = [
    { name: 'สมชาย ใจดี', id: 'T25680818', registerDate: '18/08/2568', expiryDate: '-', type: 'ผู้ดูแลระบบขั้นสูง', status: 'ใช้งานอยู่', lastActive: 'ตอนนี้' },
    { name: 'วันดี สุขใจ', id: 'A25680820', registerDate: '20/08/2568', expiryDate: '-', type: 'ผู้ดูแลระบบ', status: 'ใช้งานอยู่', lastActive: 'เมื่อ 20 นาทีที่แล้ว' },
    { name: 'มกรา ปีใหม่', id: 'T25680923', registerDate: '23/09/2568', expiryDate: '22/12/2568', type: 'พนักงานภายนอก', status: 'ใช้งานอยู่', lastActive: 'เมื่อ 2 ชั่วโมงที่แล้ว' },
    { name: 'สมร รักดี', id: 'A25681105', registerDate: '05/11/2568', expiryDate: '06/12/2568', type: 'ผู้เยี่ยมชม', status: 'ใช้งานอยู่', lastActive: 'เมื่อ 1 วันที่แล้ว' },
    { name: 'ดูดี หล่อรวย', id: 'U25681016', registerDate: '16/10/2568', expiryDate: '15/10/2570', type: 'ผู้ขอใช้สิทธิ', status: 'ใช้งานอยู่', lastActive: 'เมื่อ 5 วันที่แล้ว' },
    { name: 'แสน สาหัส', id: 'U25681013', registerDate: '13/10/2568', expiryDate: '-', type: 'พนักงานประจำ', status: 'ใช้งานอยู่', lastActive: 'เมื่อ 9 วันที่แล้ว' },
    { name: 'มั่งมี ศรีสุข', id: 'S25680902', registerDate: '02/09/2568', expiryDate: '01/12/2568', type: 'รปภ. (กำหนดเอง)', status: 'ระงับ', lastActive: 'เมื่อ 45 วันที่แล้ว' }
  ];

  // Dropdown options
  userTypes = [
    { label: 'ประเภทผู้ใช้', value: null },
    { label: 'พนักงาน', value: 'staff' },
    { label: 'ผู้เยี่ยมชม', value: 'visitor' }
  ];

  statuses = [
    { label: 'สถานะ', value: null },
    { label: 'ใช้งานอยู่', value: 'active' },
    { label: 'ระงับ', value: 'suspended' }
  ];

  sortOptions = [
    { label: 'เรียงตาม', value: null },
    { label: 'ชื่อ', value: 'name' }
  ];

  selectedType: any;
  selectedDate: any;
  selectedStatus: any;
  selectedSort: any;
  selectedUsers: any[] = [];

  constructor(private modalService: ModalService) {}

  ngOnInit() {}

  ngOnDestroy() {}

  getSeverity(status: string) {
    switch (status) {
      case 'ใช้งานอยู่': return 'info';
      case 'ระงับ': return 'warn';
      default: return 'secondary';
    }
  }

  openChat(user: any) {
    this.modalService.addModal('chatmodal', user.id);
  }
}