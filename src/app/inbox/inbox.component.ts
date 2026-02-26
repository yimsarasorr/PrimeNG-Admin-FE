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
import { ConfirmationService, MessageService } from 'primeng/api';

import { BuildingService } from '../service/building.service';

@Component({
  selector: 'app-buiding',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    TableModule, ButtonModule, InputTextModule, TagModule,
    CheckboxModule, CardModule, DropdownModule, IconFieldModule,
    InputIconModule, DialogModule, ConfirmDialogModule, ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  metrics: any[] = [];
  buildings: any[] = [];
  selectedBuildings: any[] = [];

  // สำหรับ Modal เพิ่ม/แก้ไข
  displayModal: boolean = false;
  isEditMode: boolean = false;
  buildingForm = { id: '', name: '', detail: '', zone: 'Zone A', status: 'เปิดทำการ' };

  zoneOptions = [{ label: 'Zone A', value: 'Zone A' }, { label: 'Zone B', value: 'Zone B' }, { label: 'Zone C', value: 'Zone C' }];
  statusOptions = [{ label: 'เปิดทำการ', value: 'เปิดทำการ' }, { label: 'กำลังจะปิด', value: 'กำลังจะปิด' }, { label: 'ปิดทำการ', value: 'ปิดทำการ' }];

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
      next: (data: any[]) => { // ✅ เติม : any[] ตรงนี้
        this.buildings = data;
        this.calculateMetrics(data);
      },
      error: (err: any) => console.error(err) // ✅ เติม : any ตรงนี้
    });
  }

  calculateMetrics(data: any[]) {
    const totalRooms = 454; // สมมติค่า
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
    this.buildingForm = { id: '', name: '', detail: '', zone: 'Zone A', status: 'เปิดทำการ' };
    this.displayModal = true;
  }

  openEditModal(building: any) {
    this.isEditMode = true;
    this.buildingForm = { ...building };
    this.displayModal = true;
  }

  saveBuilding() {
    if (!this.buildingForm.name || !this.buildingForm.detail) {
      this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'กรุณากรอกข้อมูลให้ครบ' });
      return;
    }

    if (this.isEditMode) {
      this.buildingService.updateBuilding(this.buildingForm.id, this.buildingForm).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'แก้ไขข้อมูลสำเร็จ (บันทึก Log แล้ว)' });
          this.displayModal = false;
          this.loadBuildings();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถแก้ไขได้' })
      });
    } else {
      this.buildingService.createBuilding(this.buildingForm).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มอาคารสำเร็จ (บันทึก Log แล้ว)' });
          this.displayModal = false;
          this.loadBuildings();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่สามารถบันทึกได้' })
      });
    }
  }

  deleteBuilding(building: any) {
    this.confirmationService.confirm({
      message: `คุณต้องการลบอาคาร <b>${building.name}</b> ใช่หรือไม่? (การกระทำนี้จะถูกบันทึกลง Log)`,
      header: 'ยืนยันการลบ',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.buildingService.deleteBuilding(building.id, building.name).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบข้อมูลสำเร็จ (บันทึก Log แล้ว)' });
            this.loadBuildings();
          }
        });
      }
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'เปิดทำการ': return 'text-blue-500';
      case 'กำลังจะปิด': return 'text-yellow-500';
      case 'ปิดทำการ': return 'text-gray-400';
      default: return 'text-gray-700';
    }
  }
}