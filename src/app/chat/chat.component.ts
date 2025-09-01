import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ActivatedRoute, Router } from '@angular/router'; // <-- Import ActivatedRoute and Router

interface ChatUser {
  id: number; // Add id
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface ChatMessage {
  userId: number; // Add userId
  sender: string;
  avatar: string;
  content: string;
  time: string;
  own?: boolean;
}

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    FormsModule,
    AvatarGroupModule,
    BadgeModule,
    OverlayBadgeModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  users: ChatUser[] = [
    { id: 1, name: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', lastMessage: "Hey there! I've heard about...", time: '12:30', unread: 8, online: true },
    { id: 2, name: 'PrimeTek Team', avatar: 'https://i.pravatar.cc/40?img=2', lastMessage: "Let's implement PrimeNG...", time: '11:15', unread: 0, online: true },
    { id: 3, name: 'Jerome Bell', avatar: 'https://i.pravatar.cc/40?img=3', lastMessage: "Absolutely! PrimeNG's...", time: '11:15', unread: 6, online: true }
  ];

  messages: ChatMessage[] = [
    { userId: 1, sender: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', content: "Awesome! What's the standout feature?", time: '11:15' },
    { userId: 2, sender: 'PrimeTek Team', avatar: 'https://i.pravatar.cc/40?img=2', content: "PrimeNG rocks! Simplifies UI dev with versatile components.", time: '11:16', own: true },
    { userId: 1, sender: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', content: "Intriguing! Tell us more about its impact.", time: '11:17' }
  ];

  newMessage: string = '';
  selectedUser: ChatUser | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      const userId = +params['userId'];
      if (userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          this.selectedUser = user;
        }
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      this.messages.push({
        userId: this.selectedUser.id,
        sender: 'You',
        avatar: 'https://i.pravatar.cc/40?img=4',
        content: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        own: true
      });
      this.newMessage = '';
    }
  }

  selectUser(user: ChatUser) {
    this.selectedUser = user;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { userId: user.id },
      queryParamsHandling: 'merge'
    });
  }

  get filteredMessages() {
    if (!this.selectedUser) return [];
    return this.messages.filter(msg => msg.userId === this.selectedUser!.id);
  }
}
