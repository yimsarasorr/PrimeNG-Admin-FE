import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    CheckboxModule,
    ChipModule,
    InputSwitchModule,
    SliderModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  // Summary Metrics
  metrics = [
    { title: 'รายการจอง', value: '1,247', subtext: '+2 การจอง', icon: 'pi pi-users', color: 'text-blue-600' },
    { title: 'การจองที่ยังไม่ถึงเวลา', value: '892', subtext: '+1 การจอง', icon: 'pi pi-user', color: 'text-yellow-500' },
    { title: 'การจองที่ถึงกำหนด', value: '267', subtext: '+1 การจอง', icon: 'pi pi-shopping-bag', color: 'text-green-500' },
    { title: 'การจองที่หมดอายุ', value: '88', subtext: '+1 การจอง', icon: 'pi pi-briefcase', color: 'text-red-500' }
  ];

  // Table Data
  reservations: any[] = [];
  selectedReservations: any[] = [];

  // Filter properties
  selectedDate: Date | null = null;
  selectedStatus: any;
  selectedBuilding: any;

  ngOnInit() {
    this.reservations = [
      { user: 'สมชาย ใจดี', id: 'T25680818', date: '18/08/2568', time: '00.00-23.59', room: 'E12-203', type: '1-Day', invitee: '-', status: 'ถึงกำหนด' },
      { user: 'วันดี สุขใจ', id: 'A25680820', date: '20/08/2568', time: '00.00-23.59', room: 'E12-203', type: '1-Day', invitee: 'สมชาย ใจดี', status: 'ยังไม่ถึงกำหนด' },
      { user: 'มกรา ปีใหม่', id: 'T25680923', date: '23/09/2568', time: '8.00-17.00', room: 'E12-203', type: 'Business', invitee: '-', status: 'หมดอายุ' },
      { user: 'สมร รักดี', id: 'A25681105', date: '05/11/2568', time: '00.00-23.59', room: 'E12-203', type: '1-Day', invitee: 'สมชาย ใจดี', status: 'ถึงกำหนด' },
      { user: 'ดูดี หล่อรวย', id: 'U25681016', date: '16/10/2568', time: '8.00-17.00', room: 'E12-203', type: 'Business', invitee: 'สมชาย ใจดี', status: 'ยังไม่ถึงกำหนด' }
    ];
  }

  getSeverity(status: string) {
    switch (status) {
      case 'ถึงกำหนด': return 'success';
      case 'ยังไม่ถึงกำหนด': return 'warn';
      case 'หมดอายุ': return 'danger';
      default: return 'info';
    }
  }
}