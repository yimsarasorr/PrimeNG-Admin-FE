import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { SortEvent } from 'primeng/api';

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
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { environment } from '../../environments/environment';

import { ReservationService } from '../service/reservation.service';
import { UserService } from '../service/user.service'; 
import { BuildingService } from '../service/building.service'; 

// 🚀 แก้ไขจุดที่ 1 และ 2: Import SupabaseClient และ createClient เข้ามาให้ถูกต้อง
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule, 
    CardModule, ButtonModule, TagModule, InputTextModule, 
    CheckboxModule, TableModule, DropdownModule, CalendarModule, 
    IconFieldModule, InputIconModule, DialogModule, ToastModule, 
    ConfirmDialogModule, ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService], 
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnDestroy {
  
  // ✅ เก็บ Supabase ไว้สำหรับการทำ Realtime Subscription เท่านั้น
  private supabase: SupabaseClient;
  realtimeChannel: any;

  allReservations: any[] = [];
  reservations: any[] = [];
  metrics: any[] = [];
  userOptions: any[] = []; 
  
  selectedReservations: any[] = []; 
  buildingsList: any[] = [];
  buildingOptions: any[] = [];
  roomGroupOptions: any[] = [];

  displayAddModal: boolean = false;
  loading: boolean = false;
  
  // สำหรับ Filter ในหน้าตาราง
  selectedFilter: string = 'รายการจองทั้งหมด';
  selectedDate: Date | undefined;
  
  newRes: any = {
    user: null,
    date: null as Date | null,
    startTime: null as Date | null,
    endTime: null as Date | null,
    time: '', 
    selectedBuilding: null,
    room: null,
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
    private buildingService: BuildingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    // กำหนดค่า SupabaseClient สำหรับ Realtime เท่านั้น (ไม่ได้ใช้ดึงข้อมูลตรงๆ)
    this.supabase = createClient(environment.supabaseUrl2, environment.supabaseKey2);
  }

  async ngOnInit() {
    this.loadReservations(); 
    this.loadUsersForDropdown(); 
    this.loadBuildings();
    this.setupRealtimeSubscription(); // เปิดการรับข้อมูล Realtime
  }

  ngOnDestroy() {
    // คืนค่าหน่วยความจำ ลบ Subscription เมื่อปิดหน้าเว็บ
    if (this.realtimeChannel) {
      this.supabase.removeChannel(this.realtimeChannel);
    }
  }

  // ✅ ฟังก์ชันจับตาดู Database (ถ้าตาราง reservations มีการอัปเดต จะเรียกโหลดตารางใหม่)
  setupRealtimeSubscription() {
    this.realtimeChannel = this.supabase
      .channel('public:reservations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        // 🚀 แก้ไขจุดที่ 3: ระบุให้ payload มี type เป็น any
        (payload: any) => {
          console.log('🔄 ข้อมูลมีการเปลี่ยนแปลงบน Database (Realtime):', payload);
          this.loadReservations(); 
        }
      )
      .subscribe();
  }

  loadBuildings() {
    this.buildingService.getBuildings().subscribe({
      next: (data) => {
        this.buildingsList = data;
        this.buildingOptions = data.map(b => ({ label: b.name, value: b }));
      }
    });
  }

loadReservations() {
    this.loading = true;

    // 🚀 เปลี่ยนมาเรียก API จาก NestJS
    this.reservationService.getAllReservations().subscribe({
      next: (data: any[]) => {
        
        // ข้อมูลจาก NestJS ได้ถูกจัด Format (เช่น วันที่) มาให้แล้ว นำไปใช้ได้เลย
        this.allReservations = data.map(r => ({
          ...r, 
          _raw: { id: r.id } 
        }));

        // 🚀 เรียกฟังก์ชันคำนวณ Metrics เอง (เพราะ NestJS ไม่ได้คำนวณมาให้)
        this.calculateMetrics(this.allReservations);

        // อัปเดตตารางตาม Filter
        this.filterReservations(this.selectedFilter);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
        this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ดึงข้อมูลไม่สำเร็จ' });
        this.loading = false;
      }
    });
  }

  // ✅ เอาฟังก์ชันคำนวณ Metrics กลับมา (ดัดแปลงคำให้ตรงกับ Filter)
  calculateMetrics(data: any[]) {
    const total = data.length;
    // สมมติว่าใน DB คุณเก็บ status เป็น 'รออนุมัติ', 'จองล่วงหน้า', 'กำลังใช้งาน', 'เสร็จสิ้น', ฯลฯ
    const pending = data.filter(r => r.status === 'รออนุมัติ' || r.status === 'จองล่วงหน้า' || r.status === 'ยังไม่ใช้งาน').length;
    const active = data.filter(r => r.status === 'ใช้งานแล้ว' || r.status === 'กำลังใช้งาน').length;
    const inactive = data.filter(r => r.status === 'ปฏิเสธ' || r.status === 'หมดอายุ' || r.status === 'ยกเลิก').length;

    this.metrics = [
      { title: 'รายการจองทั้งหมด', value: total.toLocaleString(), subtext: 'Total Requests', icon: 'pi pi-users', color: 'blue' },
      { title: 'การจองที่ยังไม่ถึงเวลา', value: pending.toLocaleString(), subtext: 'Pending/Upcoming', icon: 'pi pi-clock', color: 'yellow' },
      { title: 'การจองที่ถึงกำหนด', value: active.toLocaleString(), subtext: 'Active/Completed', icon: 'pi pi-check-circle', color: 'green' },
      { title: 'การจองที่หมดอายุ', value: inactive.toLocaleString(), subtext: 'Rejected/Canceled', icon: 'pi pi-exclamation-circle', color: 'gray' }
    ];
  }

  // 💡 ปรับฟังก์ชัน applyFilters() ให้ตรงกับคำที่ Edge Function ส่งมา
  // ✅ ใช้ applyFilters ตัวนี้แค่ตัวเดียวเท่านั้น
  applyFilters() {
    let filtered = [...this.allReservations];
    
    // อิงตาม title ของ Metrics ที่ Edge Function ส่งมา (ใน response.metrics)
    const statusMap: { [key: string]: string | string[] } = {
      'รายการจอง': 'ALL',
      'รายการจองทั้งหมด': 'ALL', // เผื่อไว้เผื่อกดจาก Tab เดิม
      'การจองที่ถึงกำหนด': ['ใช้งานแล้ว', 'กำลังใช้งาน'], 
      'การจองที่ยังไม่ถึงเวลา': ['ยังไม่ใช้งาน', 'จองล่วงหน้า'],
      'การจองที่หมดอายุ': ['หมดอายุ', 'ยกเลิก']
    };

    const targetStatus = statusMap[this.selectedFilter] || 'ALL';

    if (targetStatus !== 'ALL') {
      if (Array.isArray(targetStatus)) {
        filtered = filtered.filter(r => targetStatus.includes(r.status));
      } else {
        filtered = filtered.filter(r => r.status === targetStatus);
      }
    }

    if (this.selectedDate) {
      const filterDateStr = this.formatDateToThai(this.selectedDate);
      filtered = filtered.filter(r => r.date === filterDateStr);
    }
    
    this.reservations = filtered;
  }

  updateStatus(reservation: any, newStatus: string) {
    const payload = { status: newStatus };
    const targetId = reservation._raw?.id || reservation.id;
    
    this.reservationService.updateReservation(targetId, payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: `เปลี่ยนสถานะเป็น "${newStatus}" เรียบร้อยแล้ว` });
        // หมายเหตุ: เราไม่จำเป็นต้องเรียก loadReservations() ตรงนี้อีก เพราะ Realtime จะทำงานแทน
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถอัปเดตสถานะได้' });
      }
    });
  }

  onBuildingSelect() {
    this.newRes.room = null;
    const building = this.newRes.selectedBuilding;
    if (!building || !building.floors) {
      this.roomGroupOptions = [];
      return;
    }

    this.roomGroupOptions = building.floors.map((floor: any) => ({
      label: floor.floorName,
      items: floor.rooms.map((room: any) => {
        const roomName = typeof room === 'string' ? room : room.name;
        const roomStatus = typeof room === 'string' ? 'ว่าง' : room.status;

        return {
          label: roomStatus === 'ว่าง' ? roomName : `${roomName} (${roomStatus})`,
          value: roomName,
          disabled: roomStatus !== 'ว่าง' 
        };
      })
    }));
  }

  loadUsersForDropdown() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        const filtered = users.filter(u => u.category === 'Hybrid' || u.category === 'External');
        this.userOptions = filtered.map(u => ({
          label: `${u.first_name || u.firstName} ${u.last_name || u.lastName} (${u.company})`,
          value: `${u.first_name || u.firstName} ${u.last_name || u.lastName}`
        }));
      }
    });
  }

  confirmUpdateStatus(reservation: any, newStatus: string) {
    const actionText = newStatus === 'อนุมัติแล้ว' ? 'อนุมัติ' : 'ปฏิเสธ';
    const iconClass = newStatus === 'อนุมัติแล้ว' ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500';
    const buttonClass = newStatus === 'อนุมัติแล้ว' ? 'p-button-success' : 'p-button-danger';

    this.confirmationService.confirm({
      message: `คุณแน่ใจหรือไม่ที่จะ <b>${actionText}</b> สิทธิ์การเข้าอาคารของ <b>${reservation.user}</b>?`,
      header: `ยืนยันการ${actionText}`,
      icon: iconClass,
      acceptLabel: 'ยืนยัน',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: buttonClass,
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.updateStatus(reservation, newStatus);
      }
    });
  }

  showAddModal() {
    this.displayAddModal = true;
    this.newRes = { 
        user: null, date: null, startTime: null, endTime: null, time: '', 
        selectedBuilding: null, room: null, type: 'Meeting', invitee: '' 
    };
    this.roomGroupOptions = [];
  }

  saveReservation() {
    if (this.newRes.startTime && this.newRes.endTime) {
        const startH = String(this.newRes.startTime.getHours()).padStart(2, '0');
        const startM = String(this.newRes.startTime.getMinutes()).padStart(2, '0');
        const endH = String(this.newRes.endTime.getHours()).padStart(2, '0');
        const endM = String(this.newRes.endTime.getMinutes()).padStart(2, '0');
        this.newRes.time = `${startH}:${startM}-${endH}:${endM}`;
    }

    if (!this.newRes.user || !this.newRes.date || !this.newRes.room) {
      this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'กรุณากรอกข้อมูลให้ครบ' });
      return;
    }

    const validFrom = new Date(this.newRes.date);
    if(this.newRes.startTime) {
      validFrom.setHours(this.newRes.startTime.getHours(), this.newRes.startTime.getMinutes());
    }

    const expiresAt = new Date(this.newRes.date);
    if(this.newRes.endTime) {
      expiresAt.setHours(this.newRes.endTime.getHours(), this.newRes.endTime.getMinutes());
    }

    const payload = {
        host_id: this.newRes.user, 
        valid_from: validFrom.toISOString(),
        expires_at: expiresAt.toISOString(),
        building_id: this.newRes.selectedBuilding.name,
        room_id: this.newRes.room,
        pass_type: this.newRes.type,
        invite_code: this.newRes.invitee || `INV-${Math.floor(Math.random() * 10000)}`, // จำลองรหัสเชิญถ้าไม่มี
        status: 'รออนุมัติ' 
    };

    this.reservationService.createReservation(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มการจองเรียบร้อย' });
        this.displayAddModal = false;
        // ไม่ต้อง this.loadReservations() เพราะมี Realtime อยู่แล้ว
      },
      error: (err) => {
        console.error('Error creating reservation:', err);
        this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถสร้างการจองได้' });
      }
    });
  }

  // ✅ ระบบค้นหาและตัวกรอง Tab 
  filterReservations(title: string) {
    this.selectedFilter = title;
    this.applyFilters();
  }

  onDateChange() {
    this.applyFilters();
  }

  clearDate() {
    this.selectedDate = undefined;
    this.applyFilters();
  }

  // ✅ ระบบจัดเรียงวันที่ภาษาไทยที่แม่นยำ
  customSort(event: SortEvent) {
    if (!event.data || !event.field) return;

    event.data.sort((data1: any, data2: any) => {
      let value1 = data1[event.field!];
      let value2 = data2[event.field!];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (event.field === 'date' && typeof value1 === 'string' && typeof value2 === 'string') {
        const parseDate = (dateStr: string) => {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            return parseInt(parts[2], 10) * 10000 + parseInt(parts[1], 10) * 100 + parseInt(parts[0], 10);
          }
          return 0;
        };
        const d1 = parseDate(value1);
        const d2 = parseDate(value2);

        if (d1 < d2) result = -1;
        else if (d1 > d2) result = 1;
        else {
          const t1 = data1['time'] || '';
          const t2 = data2['time'] || '';
          result = t1.localeCompare(t2);
        }
      }
      else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2, undefined, { numeric: true });
      }
      else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }

      return (event.order || 1) * (result || 0);
    });
  }

  formatDateToThai(date: Date): string {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = (date.getFullYear() + 543).toString();
    return `${d}/${m}/${y}`;
  }

  getSeverity(status: string): any {
    switch (status) {
      case 'อนุมัติแล้ว': 
      case 'สำเร็จ': return 'success';
      case 'กำลังใช้งาน': return 'info';
      case 'รออนุมัติ':
      case 'จองล่วงหน้า': return 'warning';
      case 'ปฏิเสธ':
      case 'หมดอายุ': 
      case 'ยกเลิก': return 'danger';
      default: return 'info';
    }
  }

  getMetricCardClass(metric: any): string {
    const isSelected = this.selectedFilter === metric.title;
    const baseClass = 'shadow-2 border-round-xl h-full cursor-pointer border-2 transition-colors transition-duration-200';
    const color = metric.color || 'blue';

    if (isSelected) {
      return `${baseClass} border-${color}-500 bg-${color}-50`;
    } else {
      return `${baseClass} border-transparent bg-white hover:border-${color}-200`;
    }
  }

  // ✅ เพิ่มฟังก์ชันจัดการสีตัวหนังสือของ Metric
  getMetricTextClass(metric: any, shade: number): string {
    const color = metric.color || 'blue';
    return `text-${color}-${shade}`;
  }
}