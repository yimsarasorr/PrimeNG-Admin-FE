import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card'; // <-- Added CardModule
import { IconFieldModule } from 'primeng/iconfield'; 
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    TagModule,
    CheckboxModule,
    CardModule,      // <-- Added to imports
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  // Dropdown Options
  zones = [
    { label: 'โซน 1', value: 'zone1' },
    { label: 'โซน 2', value: 'zone2' }
  ];
  
  statuses = [
    { label: 'สถานะ', value: null },
    { label: 'ปกติ', value: 'normal' },
    { label: 'ผิดปกติ', value: 'abnormal' }
  ];

  sortOptions = [
    { label: 'เรียงตาม', value: null },
    { label: 'ล่าสุด', value: 'latest' }
  ];

  selectedZone: any = 'zone1';
  selectedDate: Date | undefined;
  selectedStatus: any;
  selectedSort: any;

  // Metrics Data
  metrics = [
    { title: 'อาคารทั้งหมด', value: '26', subtext: '', icon: 'pi pi-building', color: 'text-blue-600' },
    { title: 'เช็คอินวันนี้', value: '57', subtext: '+5% จากเมื่อวาน', icon: 'pi pi-map-marker', color: 'text-blue-600' },
    { title: 'เพิ่มการจองวันนี้', value: '15', subtext: '+5% จากเมื่อวาน', icon: 'pi pi-book', color: 'text-blue-600' },
    { title: 'เวลาในขณะนี้', value: '11:32', subtext: 'GMT+7', icon: '', color: 'text-blue-600', isTime: true }
  ];

  // Table Data
  logs = [
    { id: 1, date: '12 / 12 / 2568 11:32', user: 'abc', action: 'เช็คอิน', target: 'ตึก B', status: 'normal', details: '' },
    { id: 2, date: '12 / 12 / 2568 11:21', user: 'def', action: 'อยู่ที่', target: 'อาคาร 12 ชั้น', status: 'warning', details: 'เกินเวลาที่กำหนด' },
    { id: 3, date: '12 / 12 / 2568 11:04', user: 'hij', action: 'เพิ่มการจอง', target: 'ภาควิชาวิศวกรรมโยธา', status: 'info', details: '' },
    { id: 4, date: '12 / 12 / 2568 11:32', user: 'abc', action: 'เช็คอิน', target: 'ตึก B', status: 'normal', details: '' },
    { id: 7, date: '12 / 12 / 2568 11:32', user: 'abc', action: 'เช็คอิน', target: 'ตึก B', status: 'error', details: 'โดยไม่มีสิทธิ์' }
  ];

  selectedLogs: any[] = [];

  ngOnInit(): void {}
}