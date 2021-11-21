import { Component } from '@angular/core';
import { ChatState } from './services/chat.domain';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ws-chat-front';

  chatId: number | null = null;
  loading: boolean = false;
  messages!: ChatState;

  constructor(public chatSrc: ChatService) {}

  showChatMessages(id: number | null) {
    this.chatId = id;
    this.loading = true;
    if (id) {
      console.log(`Subscribing to ${id}`);
      this.chatSrc.subscribeToChat(id, (messages) => {
        if (typeof messages === 'string') {
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

  callSupport() {
    this.chatSrc.sendSupportRequest();
  }
}
