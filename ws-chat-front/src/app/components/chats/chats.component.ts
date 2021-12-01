import { Component, OnInit } from '@angular/core';
import { ChatState } from 'src/app/services/chat.domain';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  chatId: number | null = null;
  loading: boolean = false;
  messages!: ChatState;

  constructor(public chatSrc: ChatService) { }

  ngOnInit(): void {
  }
  
  showChatMessages(id: number | null) {
    this.chatId = id;
    this.loading = true;
    if (id) {
      console.log(`Subscribing to ${id}`);
      this.chatSrc.subscribeToChat(id, (messages) => {
        if (typeof messages === 'object') {
          console.log('Got messages');
          if (this.messages == null) {
            this.messages = new ChatState(id, [messages]);
          } else {
            this.messages.messages.push(messages);
          }
        }
        if (Array.isArray(messages)) {
          console.log('Got messages');
          this.messages = new ChatState(id, messages);
          this.loading = false;
        }
      });
    }
  }

  sendMessage(id: number, msg: string) {
    this.chatSrc.sendMsg(id, msg);
  }
  sendMessageDirectly(id: number, msg: string) {
    this.chatSrc.sendMsgDirectly(id, msg);
  }
}
