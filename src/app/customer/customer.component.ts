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
import { ChatService } from '../service/chat.service';

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
    {
      id: 1,
      name: 'Cody Fisher',
      avatar: 'https://i.pravatar.cc/40?img=1',
      title: 'Software Engineer',
      company: 'PrimeTek',
      email: 'cody@primetek.com',
      status: 'Active',
      online: true
    },
    {
      id: 2,
      name: 'PrimeTek Team',
      avatar: 'https://i.pravatar.cc/40?img=2',
      title: 'Team',
      company: 'PrimeTek',
      email: 'team@primetek.com',
      status: 'Active',
      online: true
    },
    {
      id: 3,
      name: 'Jerome Bell',
      avatar: 'https://i.pravatar.cc/40?img=3',
      title: 'Product Manager',
      company: 'PrimeTek',
      email: 'jerome@primetek.com',
      status: 'Inactive',
      online: true
    }
  ];

  ref: DynamicDialogRef | undefined;
  private routeSub!: Subscription;

  constructor(
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        const customer = this.allCustomers.find(c => c.id === +id);
        if (customer) {
          this.openChat(customer, false);
        }
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
        queryParams: { id: customer.id },
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
        queryParams: { id: null },
        queryParamsHandling: 'merge'
      });
    });
  }
}
