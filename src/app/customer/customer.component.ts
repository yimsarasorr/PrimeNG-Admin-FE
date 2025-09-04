import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DynamicDialogModule, DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    BadgeModule,
    OverlayBadgeModule,
    CardModule,
    ChipModule,
    DynamicDialogModule
  ],
  providers: [DialogService],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {
  allCustomers = [
    { id: 1, name: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', title: 'Software Engineer', company: 'PrimeTek', email: 'cody@primetek.com', status: 'Active', online: true },
    { id: 2, name: 'PrimeTek Team', avatar: 'https://i.pravatar.cc/40?img=2', title: 'Team', company: 'PrimeTek', email: 'team@primetek.com', status: 'Active', online: true },
    { id: 3, name: 'Jerome Bell', avatar: 'https://i.pravatar.cc/40?img=3', title: 'Product Manager', company: 'PrimeTek', email: 'jerome@primetek.com', status: 'Inactive', online: true },
    { id: 4, name: 'Courtney Henry', avatar: 'https://i.pravatar.cc/40?img=4', title: 'Designer', company: 'PrimeTek', email: 'courtney@primetek.com', status: 'Active', online: false },
    { id: 5, name: 'Theresa Webb', avatar: 'https://i.pravatar.cc/40?img=5', title: 'QA Engineer', company: 'PrimeTek', email: 'theresa@primetek.com', status: 'Active', online: true },
    { id: 6, name: 'Wade Warren', avatar: 'https://i.pravatar.cc/40?img=6', title: 'DevOps Engineer', company: 'PrimeTek', email: 'wade@primetek.com', status: 'Inactive', online: false },
    { id: 7, name: 'Jenny Wilson', avatar: 'https://i.pravatar.cc/40?img=7', title: 'HR Manager', company: 'PrimeTek', email: 'jenny@primetek.com', status: 'Active', online: true },
    { id: 8, name: 'Kristin Watson', avatar: 'https://i.pravatar.cc/40?img=8', title: 'Marketing Specialist', company: 'PrimeTek', email: 'kristin@primetek.com', status: 'Inactive', online: false }
  ];

  ref: DynamicDialogRef | undefined;
  private routeSub!: Subscription;

  constructor(
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const initialChatId = this.route.snapshot.queryParams['chatId'];
    if (initialChatId) {
      const customer = this.allCustomers.find(c => c.id === +initialChatId);
      if (customer) {
        this.openChat(customer, false);
      }
    }

    this.routeSub = this.route.queryParams.subscribe(params => {
      const chatId = params['chatId'];
      if (chatId) {
        const customer = this.allCustomers.find(c => c.id === +chatId);
        if (customer) {
          this.openChat(customer, false);
        }
      } else if (!chatId && this.ref) {
        this.ref.close();
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.ref) this.ref.close();
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'secondary';
      default: return 'info';
    }
  }

  openChat(customer: any, updateUrl: boolean = true) {
    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { chatId: customer.id },
        queryParamsHandling: 'merge'
      });
    }

    this.ref = this.dialogService.open(ChatDialogComponent, {
      data: { userId: customer.id, name: customer.name, avatar: customer.avatar },
      header: `${customer.name} - Chat`,
      style: { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' },
      contentStyle: { height: '100%' },
      modal: true,
      dismissableMask: true,
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { chatId: null },
        queryParamsHandling: 'merge'
      });
    });
  }
}