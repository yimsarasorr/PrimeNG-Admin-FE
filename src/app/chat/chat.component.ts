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




interface ChatUser {
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface ChatMessage {
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
    { name: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', lastMessage: "Hey there! I've heard about...", time: '12:30', unread: 8, online: true },
    { name: 'PrimeTek Team', avatar: 'https://i.pravatar.cc/40?img=2', lastMessage: "Let's implement PrimeNG...", time: '11:15', unread: 0, online: true },
    { name: 'Jerome Bell', avatar: 'https://i.pravatar.cc/40?img=3', lastMessage: "Absolutely! PrimeNG's...", time: '11:15', unread: 6, online: true }
  ];

  messages: ChatMessage[] = [
    { sender: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', content: "Awesome! What's the standout feature?", time: '11:15' },
    { sender: 'PrimeTek Team', avatar: 'https://i.pravatar.cc/40?img=2', content: "PrimeNG rocks! Simplifies UI dev with versatile components.", time: '11:16', own: true },
    { sender: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', content: "Intriguing! Tell us more about its impact.", time: '11:17' }
  ];

  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        sender: 'You',
        avatar: 'https://i.pravatar.cc/40?img=4',
        content: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        own: true
      });
      this.newMessage = '';
    }
  }
}
