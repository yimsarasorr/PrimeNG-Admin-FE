import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface ChatMessage {
  userId: number;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  own?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private usersData: ChatUser[] = [
    { id: 1, name: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', lastMessage: "Hey there! I've heard about...", time: '12:30', unread: 8, online: true },
    { id: 2, name: 'PrimeTek Team', avatar: 'https://i.pravatar.cc/40?img=2', lastMessage: "Let's implement PrimeNG...", time: '11:15', unread: 0, online: true },
    { id: 3, name: 'Jerome Bell', avatar: 'https://i.pravatar.cc/40?img=3', lastMessage: "Absolutely! PrimeNG's...", time: '11:15', unread: 6, online: true }
  ];

  private messagesData: ChatMessage[] = [
    { userId: 1, sender: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', content: "Awesome! What's the standout feature?", time: '11:15' },
    { userId: 2, sender: 'PrimeTek Team', avatar: 'https://i.pravatar.cc/40?img=2', content: "PrimeNG rocks! Simplifies UI dev with versatile components.", time: '11:16', own: true },
    { userId: 1, sender: 'Cody Fisher', avatar: 'https://i.pravatar.cc/40?img=1', content: "Intriguing! Tell us more about its impact.", time: '11:17' }
  ];

  users$ = new BehaviorSubject<ChatUser[]>(this.usersData);
  messages$ = new BehaviorSubject<ChatMessage[]>(this.messagesData);

  getUsers() {
    return this.users$;
  }

  getMessagesForUser(userId: number) {
    return this.messages$.value.filter(m => m.userId === userId);
  }

  addMessage(message: ChatMessage) {
    const updated = [...this.messages$.value, message];
    this.messages$.next(updated);

    // update last message for user
    const users = this.users$.value.map(u =>
      u.id === message.userId ? { ...u, lastMessage: message.content, time: message.time } : u
    );
    this.users$.next(users);
  }
}
