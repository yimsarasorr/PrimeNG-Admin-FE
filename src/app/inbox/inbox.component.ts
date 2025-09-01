import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { DockModule } from 'primeng/dock';
import { ProgressBarModule } from 'primeng/progressbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    CheckboxModule,
    DockModule,
    ProgressBarModule,
    PanelMenuModule,
    RouterOutlet
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent {

  // Sidebar Navigation
  navItems: MenuItem[] = [
    {
      label: 'Inbox',
      icon: 'pi pi-envelope',
      routerLink: '/inbox/list'
    },
    {
      label: 'Starred',
      icon: 'pi pi-comments',
      routerLink: '/inbox/star'
    },
    {
      label: 'Drafts',
      icon: 'pi pi-inbox',
      routerLink: '/inbox/draft'
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: '/inbox/settings'
    }
  ];

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
