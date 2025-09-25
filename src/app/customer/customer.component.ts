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
    ChipModule
  ],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {
  allCustomers = [
    { id: 1, name: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', title: 'Software Engineer', company: 'PrimeTek', email: 'cody@primetek.com', leadSource: 'LinkedIn', status: 'Active', online: true },
    { id: 2, name: 'PrimeTek Team', avatar: 'https://i.pravatar.cc/40?img=2', title: 'Team', company: 'PrimeTek', email: 'team@primetek.com', leadSource: 'Website', status: 'Active', online: true },
    { id: 3, name: 'Jerome Bell', avatar: 'https://i.pravatar.cc/40?img=3', title: 'Product Manager', company: 'PrimeTek', email: 'jerome@primetek.com', leadSource: 'Referral', status: 'Inactive', online: true },
    { id: 4, name: 'Courtney Henry', avatar: 'https://i.pravatar.cc/40?img=4', title: 'Designer', company: 'PrimeTek', email: 'courtney@primetek.com', leadSource: 'Website', status: 'Active', online: false },
    { id: 5, name: 'Theresa Webb', avatar: 'https://i.pravatar.cc/40?img=5', title: 'QA Engineer', company: 'PrimeTek', email: 'theresa@primetek.com', leadSource: 'LinkedIn', status: 'Active', online: true },
    { id: 6, name: 'Wade Warren', avatar: 'https://i.pravatar.cc/40?img=6', title: 'DevOps Engineer', company: 'PrimeTek', email: 'wade@primetek.com', leadSource: 'Referral', status: 'Inactive', online: false },
    { id: 7, name: 'Jenny Wilson', avatar: 'https://i.pravatar.cc/40?img=7', title: 'HR Manager', company: 'PrimeTek', email: 'jenny@primetek.com', leadSource: 'Website', status: 'Active', online: true },
    { id: 8, name: 'Kristin Watson', avatar: 'https://i.pravatar.cc/40?img=8', title: 'Marketing Specialist', company: 'PrimeTek', email: 'kristin@primetek.com', leadSource: 'LinkedIn', status: 'Inactive', online: false }
  ];

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    // Check if app.component wants to open a chat via query param
    const initialChatId = this.route.snapshot.queryParams['chatId'];
    if (initialChatId) {
      const customer = this.allCustomers.find(c => c.id === +initialChatId);
      if (customer) this.navigateToChat(customer);
    }

    // Subscribe to changes
    this.routeSub = this.route.queryParams.subscribe(params => {
      const chatId = params['chatId'];
      if (chatId) {
        const customer = this.allCustomers.find(c => c.id === +chatId);
        if (customer) this.navigateToChat(customer);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'secondary';
      default: return 'info';
    }
  }

  // Only update query param to trigger AppComponent modal
  navigateToChat(customer: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { chatId: customer.id },
      queryParamsHandling: 'merge'
    });
  }
}
