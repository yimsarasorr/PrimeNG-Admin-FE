import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChatService, ChatMessage } from '../../service/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarModule, ButtonModule, InputTextModule],
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent {
  userId!: number;
  name!: string;
  avatar!: string;
  newMessage: string = '';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private chatService: ChatService,
    private router: Router
  ) {
    this.userId = config.data.userId;
    this.name = config.data.name;
    this.avatar = config.data.avatar;
  }

  get messages(): ChatMessage[] {
    return this.chatService.getMessagesForUser(this.userId);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.addMessage({
        userId: this.userId,
        sender: 'Me',
        avatar: 'https://i.pravatar.cc/40?img=4',
        content: this.newMessage,
        time: new Date().toLocaleTimeString(),
        own: true
      });
      this.newMessage = '';
    }
  }

  closeDialog() {
    this.ref.close();
  }

  openAnotherChat(id: number) {
    this.router.navigate([], {
      queryParams: { chatId: id },
      queryParamsHandling: 'merge'
    });
  }

  openVideoById(id: number) {
    this.router.navigate([], {
      queryParams: { videoId: id },
      queryParamsHandling: 'merge'
    });
  }
}
