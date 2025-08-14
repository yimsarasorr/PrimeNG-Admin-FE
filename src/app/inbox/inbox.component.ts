import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    CheckboxModule
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent {

  // Example inbox messages
  messages = [
    { subject: 'Meeting Reminder', sender: 'Alice', date: '2025-08-14', status: 'Unread' },
    { subject: 'Project Update', sender: 'Bob', date: '2025-08-13', status: 'Read' },
    { subject: 'Invoice #432', sender: 'Charlie', date: '2025-08-12', status: 'Unread' }
  ];

  getSeverity(status: string) {
    switch (status) {
      case 'Unread':
        return 'danger';
      case 'Read':
        return 'success';
      default:
        return 'info';
    }
  }

}
