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
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService, MessageService } from 'primeng/api';

import { BuildingService } from '../service/building.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    TableModule, ButtonModule, InputTextModule, TagModule,
    CheckboxModule, CardModule, DropdownModule, IconFieldModule,
    InputIconModule, DialogModule, ConfirmDialogModule, ToastModule,
    ChipsModule, CalendarModule, DividerModule, MultiSelectModule
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

  buildingForm = { 
    id: '', 
    name: '', 
    detail: '', 
    zone: 'building', 
    lat: 13.727679 as number | null,
    lng: 100.772299 as number | null,
    openTimeObj: null as Date | null,
    closeTimeObj: null as Date | null,
    allowed_user_types: [] as string[],
    floors: [] as { floorName: string, rooms: { name: string, status: string }[] }[]
  };

  zoneOptions = [
    { label: 'อาคาร/สำนักงาน (Building)', value: 'building' }, 
    { label: 'สิ่งอำนวยความสะดวก (Facility)', value: 'facility' }, 
    { label: 'ลานจอดรถ (Parking)', value: 'parking' }
  ];

  roomStatusOptions = [
    { label: 'ว่าง (Available)', value: 'ว่าง' },
    { label: 'ปรับปรุง (Maintenance)', value: 'ปรับปรุง' },
    { label: 'ไม่พร้อมใช้งาน (Closed)', value: 'ไม่พร้อมใช้งาน' }
  ];

  userTypeOptions = [
    { label: 'นักศึกษา (นศ.)', value: 'นศ.' },
    { label: 'บุคลากร', value: 'บุคลากร' },
    { label: 'บุคคลภายนอก', value: 'บุคคลภายนอก' }
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
      { title: 'สถานที่ทั้งหมด', value: data.length.toString(), icon: 'pi pi-map-marker' },
      { title: 'จำนวนห้อง/พื้นที่ทั้งหมด', value: totalRooms.toString(), icon: 'pi pi-home' },
      { title: 'ผู้มาเยี่ยมในขณะนี้', value: currentVisitors.toString(), icon: 'pi pi-users' },
      { title: 'การจองทั้งหมดในวันนี้', value: todayBookings.toString(), icon: 'pi pi-calendar' }
    ];
  }

  openAddModal() {
    this.isEditMode = false;
    this.buildingForm = { 
      id: '', name: '', detail: '', zone: 'building', 
      lat: 13.727679, lng: 100.772299,
      openTimeObj: null, closeTimeObj: null, 
      allowed_user_types: ['นศ.', 'บุคลากร'],
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

    const mappedFloors = (building.floors || []).map((f: any) => {
      return {
        floorName: f.floorName,
        rooms: f.rooms.map((r: any) => {
          return typeof r === 'string' ? { name: r, status: 'ว่าง' } : r;
        })
      };
    });

    let parsedUserTypes = [];
    try {
      parsedUserTypes = typeof building.allowed_user_types === 'string' 
        ? JSON.parse(building.allowed_user_types) 
        : (building.allowed_user_types || []);
    } catch (e) {
      parsedUserTypes = [];
    }

    this.buildingForm = { 
      ...building,
      lat: building.lat || 13.727679,
      lng: building.lng || 100.772299,
      openTimeObj: oTime,
      closeTimeObj: cTime,
      allowed_user_types: parsedUserTypes,
      floors: mappedFloors 
    };
    this.displayModal = true;
  }

  addFloor() {
    this.buildingForm.floors.push({ floorName: `ชั้น ${this.buildingForm.floors.length + 1}`, rooms: [] });
  }

  removeFloor(index: number) {
    this.buildingForm.floors.splice(index, 1);
  }

  addRoom(floorIndex: number, roomName: string) {
    if (roomName && roomName.trim() !== '') {
      this.buildingForm.floors[floorIndex].rooms.push({ name: roomName.trim(), status: 'ว่าง' });
    }
  }

  removeRoom(floorIndex: number, roomIndex: number) {
    this.buildingForm.floors[floorIndex].rooms.splice(roomIndex, 1);
  }

  saveBuilding() {
    if (!this.buildingForm.id || !this.buildingForm.name || !this.buildingForm.openTimeObj || !this.buildingForm.closeTimeObj) {
      this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'กรุณากรอกรหัสอาคาร ชื่อ และเวลาทำการให้ครบ' });
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
          this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มสถานที่สำเร็จ' });
          this.displayModal = false;
          this.loadBuildings();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถบันทึกได้ รหัสสถานที่อาจซ้ำ' })
      });
    }
  }

  deleteBuilding(building: any) {
    this.confirmationService.confirm({
      message: `คุณต้องการลบอาคาร/สถานที่ <b>${building.name}</b> ใช่หรือไม่?`,
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