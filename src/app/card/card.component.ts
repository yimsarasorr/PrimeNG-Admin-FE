import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ReservationService, Reservation } from '../service/reservation.service';
import { UserService } from '../service/user.service'; 

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule, 
    CardModule, ButtonModule, TagModule, InputTextModule, 
    CheckboxModule, TableModule, DropdownModule, CalendarModule, 
    IconFieldModule, InputIconModule,
    DialogModule, ToastModule 
  ],
  providers: [MessageService], 
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  
  selectedDate: Date | undefined;
  selectedReservations: Reservation[] = [];
  reservations: Reservation[] = [];

  metrics = [
    { title: 'รายการจอง', value: '...', subtext: 'กำลังโหลด...', icon: 'pi pi-users' },
    { title: 'รอใช้งาน', value: '...', subtext: 'Upcoming', icon: 'pi pi-clock' },
    { title: 'ใช้งานแล้ว', value: '...', subtext: 'Completed', icon: 'pi pi-check-circle' },
    { title: 'ยกเลิก/หมดอายุ', value: '...', subtext: 'Inactive', icon: 'pi pi-exclamation-circle' }
  ];

  displayAddModal: boolean = false;
  userOptions: any[] = []; 
  
  // ✅ เพิ่ม startTime และ endTime สำหรับรับค่าจาก Time Picker
  newRes = {
    user: null,
    date: null as Date | null,
    startTime: null as Date | null,
    endTime: null as Date | null,
    time: '', // ตัวนี้จะเก็บค่าที่รวมร่างแล้วส่งให้ API (เช่น "09:00-12:00")
    room: '',
    type: 'Meeting',
    invitee: ''
  };

  typeOptions = [
    { label: 'Meeting', value: 'Meeting' },
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Visit', value: 'Visit' }
  ];

  constructor(
    private reservationService: ReservationService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadReservations();
    this.loadUsersForDropdown(); 
  }

  loadReservations() {
    this.reservationService.getReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.calculateMetrics(data); 
      },
      error: (err) => console.error('Error loading data:', err)
    });
  }

  loadUsersForDropdown() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        const filtered = users.filter(u => u.category === 'Hybrid' || u.category === 'External');
        this.userOptions = filtered.map(u => ({
          label: `${u.first_name || u.firstName} ${u.last_name || u.lastName} (${u.company})`,
          value: `${u.first_name || u.firstName} ${u.last_name || u.lastName}`
        }));
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  showAddModal() {
    this.displayAddModal = true;
    // ✅ เคลียร์ค่าเวลากลับเป็น null ด้วย
    this.newRes = { user: null, date: null, startTime: null, endTime: null, time: '', room: '', type: 'Meeting', invitee: '' };
  }

  saveReservation() {
    // ✅ แปลงและรวมเวลาจาก Date object ให้เป็น String "HH:mm-HH:mm"
    if (this.newRes.startTime && this.newRes.endTime) {
        const startH = String(this.newRes.startTime.getHours()).padStart(2, '0');
        const startM = String(this.newRes.startTime.getMinutes()).padStart(2, '0');
        const endH = String(this.newRes.endTime.getHours()).padStart(2, '0');
        const endM = String(this.newRes.endTime.getMinutes()).padStart(2, '0');
        
        this.newRes.time = `${startH}:${startM}-${endH}:${endM}`;
    }

    // เช็คว่ากรอกข้อมูลครบไหม
    if (!this.newRes.user || !this.newRes.date || !this.newRes.time || !this.newRes.room) {
      this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (รวมถึงเวลาเริ่มต้นและสิ้นสุด)' });
      return;
    }

    // แปลงรูปแบบวันที่เป็น YYYY-MM-DD
    const year = this.newRes.date.getFullYear();
    const month = String(this.newRes.date.getMonth() + 1).padStart(2, '0');
    const day = String(this.newRes.date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    const payload = { ...this.newRes, date: formattedDate };

    this.reservationService.createReservation(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มการจองเรียบร้อยแล้ว' });
        this.displayAddModal = false;
        this.loadReservations(); 
      },
      error: (err) => {
        console.error('Error creating reservation:', err);
        this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถบันทึกข้อมูลได้' });
      }
    });
  }

  calculateMetrics(data: Reservation[]) {
    const total = data.length;
    const pending = data.filter(r => r.status === 'ยังไม่ใช้งาน').length;
    const completed = data.filter(r => r.status === 'ใช้งานแล้ว').length;
    const inactive = data.filter(r => r.status === 'หมดอายุ' || r.status === 'ยกเลิก').length;

    this.metrics = [
      { title: 'รายการจองทั้งหมด', value: total.toLocaleString(), subtext: 'Total Items', icon: 'pi pi-users' },
      { title: 'รอการใช้งาน', value: pending.toLocaleString(), subtext: 'Upcoming', icon: 'pi pi-clock' },
      { title: 'ใช้งานเสร็จสิ้น', value: completed.toLocaleString(), subtext: 'Completed', icon: 'pi pi-check-circle' },
      { title: 'ยกเลิก/หมดอายุ', value: inactive.toLocaleString(), subtext: 'Action Required', icon: 'pi pi-exclamation-circle' }
    ];
  }

  getSeverity(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'ใช้งานแล้ว': return 'success'; 
      case 'ยังไม่ใช้งาน': return 'warning';
      case 'หมดอายุ': return 'danger';
      case 'ยกเลิก': return 'danger';
      default: return 'info';
    }
  }
}