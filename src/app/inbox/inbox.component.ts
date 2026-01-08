import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    CheckboxModule,
    CardModule,
    DropdownModule,
    IconFieldModule,
    InputIconModule,
    RouterOutlet
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  // Metrics Summary for Buildings
  metrics = [
    { title: 'อาคารทั้งหมด', value: '23', icon: 'pi pi-map-marker' },
    { title: 'จำนวนห้องทั้งหมด', value: '454', icon: 'pi pi-car' },
    { title: 'ผู้มาเยี่ยมในขณะนี้', value: '76', icon: 'pi pi-bolt' }, // EV icon
    { title: 'การจองทั้งหมดในวันนี้', value: '226', icon: 'pi pi-directions' } // Bike icon
  ];

  // Building Table Data
  buildings = [
    { name: 'อาคาร 12 ชั้น (1)', detail: 'เวลาเปิด-ปิด: 08:00 - 20:00 น.', zone: 'Zone 1', visitors: 21, bookings: 25, status: 'ใช้งานอยู่' },
    { name: 'ภาควิชาวิศวกรรมอุตสาหการ (2)', detail: 'เวลาเปิด-ปิด: 08:00 - 18:00 น.', zone: 'Zone 1', visitors: 15, bookings: 45, status: 'กำลังจะปิด' },
    { name: 'ภาควิชาวิศวกรรมเครื่องกล (3)', detail: 'เวลาเปิด-ปิด: 08:00 - 20:00 น.', zone: 'Zone 1', visitors: 9, bookings: 16, status: 'ใช้งานอยู่' },
    { name: 'ภาควิชาวิศวกรรมวัดและควบคุม (4)', detail: 'เวลาเปิด-ปิด: 08:00 - 20:00 น.', zone: 'Zone 1', visitors: 3, bookings: 36, status: 'ใช้งานอยู่' },
    { name: 'ตึก B (5)', detail: 'เวลาเปิด-ปิด: 08:00 - 20:00 น.', zone: 'Zone 1', visitors: 7, bookings: 22, status: 'ใช้งานอยู่' },
    { name: 'ภาควิชาวิศวกรรมโทรคมนาคม (6)', detail: 'เวลาเปิด-ปิด: 08:00 - 20:00 น.', zone: 'Zone 1', visitors: 4, bookings: 11, status: 'ปิดใช้งานอยู่' }
  ];

  selectedBuildings: any[] = [];

  ngOnInit() {}

  getSeverity(status: string) {
    switch (status) {
      case 'ใช้งานอยู่': return 'info';
      case 'กำลังจะปิด': return 'warning';
      case 'ปิดใช้งานอยู่': return 'secondary';
      default: return 'info';
    }
  }
}