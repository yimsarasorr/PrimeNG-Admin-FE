import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ChipsModule } from 'primeng/chips';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { ConfirmationService, MessageService } from 'primeng/api';

import { BuildingService } from '../service/building.service';

@Component({
  selector: 'app-buiding',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    TableModule, ButtonModule, InputTextModule, TagModule,
    CheckboxModule, CardModule, DropdownModule, IconFieldModule,
    InputIconModule, DialogModule, ConfirmDialogModule, ToastModule,
    ChipsModule, CalendarModule, DividerModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  metrics: any[] = [];
  buildings: any[] = [];
  selectedBuildings: any[] = [];

  displayModal: boolean = false;
  isEditMode: boolean = false;

  // ✅ 1. แก้ไข Type ของ rooms ให้เป็น Object ที่เก็บ name และ status
  buildingForm = { 
    id: '', name: '', detail: '', zone: 'Zone A', 
    openTimeObj: null as Date | null,
    closeTimeObj: null as Date | null,
    floors: [] as { floorName: string, rooms: { name: string, status: string }[] }[]
  };

  zoneOptions = [{ label: 'Zone A', value: 'Zone A' }, { label: 'Zone B', value: 'Zone B' }, { label: 'Zone C', value: 'Zone C' }];

  // ✅ 2. เพิ่มตัวเลือกสถานะห้อง
  roomStatusOptions = [
    { label: 'ว่าง (Available)', value: 'ว่าง' },
    { label: 'ปรับปรุง (Maintenance)', value: 'ปรับปรุง' },
    { label: 'ไม่พร้อมใช้งาน (Closed)', value: 'ไม่พร้อมใช้งาน' }
  ];

  constructor(
    private buildingService: BuildingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadBuildings();
  }

  loadBuildings() {
    this.buildingService.getBuildings().subscribe({
      next: (data: any[]) => {
        this.buildings = data;
        this.calculateMetrics(data);
      },
      error: (err: any) => console.error(err)
    });
  }

  calculateMetrics(data: any[]) {
    let totalRooms = 0;
    data.forEach(b => {
      if (b.floors && Array.isArray(b.floors)) {
        b.floors.forEach((f: any) => {
          if (f.rooms && Array.isArray(f.rooms)) {
            totalRooms += f.rooms.length;
          }
        });
      }
    });

    const currentVisitors = data.reduce((sum, b) => sum + (b.visitors || 0), 0);
    const todayBookings = data.reduce((sum, b) => sum + (b.bookings || 0), 0);

    this.metrics = [
      { title: 'อาคารทั้งหมด', value: data.length.toString(), icon: 'pi pi-map-marker' },
      { title: 'จำนวนห้องทั้งหมด', value: totalRooms.toString(), icon: 'pi pi-home' },
      { title: 'ผู้มาเยี่ยมในขณะนี้', value: currentVisitors.toString(), icon: 'pi pi-users' },
      { title: 'การจองทั้งหมดในวันนี้', value: todayBookings.toString(), icon: 'pi pi-calendar' }
    ];
  }

  openAddModal() {
    this.isEditMode = false;
    this.buildingForm = { 
      id: '', name: '', detail: '', zone: 'Zone A', 
      openTimeObj: null, closeTimeObj: null, 
      floors: [{ floorName: 'ชั้น 1', rooms: [] }] 
    };
    this.displayModal = true;
  }

  openEditModal(building: any) {
    this.isEditMode = true;
    
    let oTime = null, cTime = null;
    if (building.open_time) {
      const today = new Date();
      const [hours, minutes] = building.open_time.split(':');
      oTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));
    }
    if (building.close_time) {
      const today = new Date();
      const [hours, minutes] = building.close_time.split(':');
      cTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));
    }

    // ✅ 3. ดักจับและแปลงข้อมูลห้องจาก String ให้กลายเป็น Object
    const mappedFloors = (building.floors || []).map((f: any) => {
      return {
        floorName: f.floorName,
        rooms: f.rooms.map((r: any) => {
          return typeof r === 'string' ? { name: r, status: 'ว่าง' } : r;
        })
      };
    });

    this.buildingForm = { 
      ...building,
      openTimeObj: oTime,
      closeTimeObj: cTime,
      floors: mappedFloors // ✅ โยน floors ที่แปลงแล้วเข้าไป
    };
    this.displayModal = true;
  }

  addFloor() {
    this.buildingForm.floors.push({ floorName: `ชั้น ${this.buildingForm.floors.length + 1}`, rooms: [] });
  }

  removeFloor(index: number) {
    this.buildingForm.floors.splice(index, 1);
  }

  // ✅ 4. เพิ่มฟังก์ชันจัดการห้อง
  addRoom(floorIndex: number, roomName: string) {
    if (roomName && roomName.trim() !== '') {
      this.buildingForm.floors[floorIndex].rooms.push({ name: roomName.trim(), status: 'ว่าง' });
    }
  }

  removeRoom(floorIndex: number, roomIndex: number) {
    this.buildingForm.floors[floorIndex].rooms.splice(roomIndex, 1);
  }

  saveBuilding() {
    if (!this.buildingForm.name || !this.buildingForm.openTimeObj || !this.buildingForm.closeTimeObj) {
      this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'กรุณากรอกชื่อและเวลาทำการให้ครบ' });
      return;
    }

    const openStr = `${String(this.buildingForm.openTimeObj.getHours()).padStart(2, '0')}:${String(this.buildingForm.openTimeObj.getMinutes()).padStart(2, '0')}`;
    const closeStr = `${String(this.buildingForm.closeTimeObj.getHours()).padStart(2, '0')}:${String(this.buildingForm.closeTimeObj.getMinutes()).padStart(2, '0')}`;

    const payload = {
      ...this.buildingForm,
      open_time: openStr,
      close_time: closeStr
    };

    if (this.isEditMode) {
      this.buildingService.updateBuilding(this.buildingForm.id, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'แก้ไขข้อมูลสำเร็จ' });
          this.displayModal = false;
          this.loadBuildings();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถแก้ไขได้' })
      });
    } else {
      this.buildingService.createBuilding(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มอาคารสำเร็จ' });
          this.displayModal = false;
          this.loadBuildings();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถบันทึกได้' })
      });
    }
  }

  deleteBuilding(building: any) {
    this.confirmationService.confirm({
      message: `คุณต้องการลบอาคาร <b>${building.name}</b> ใช่หรือไม่?`,
      header: 'ยืนยันการลบ',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.buildingService.deleteBuilding(building.id, building.name).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบข้อมูลสำเร็จ' });
            this.loadBuildings();
          }
        });
      }
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'เปิดทำการ': return 'text-blue-500';
      case 'ปิดทำการ': return 'text-gray-400';
      default: return 'text-gray-700';
    }
  }
}