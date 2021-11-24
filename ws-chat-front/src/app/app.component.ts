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

  constructor(public chatSrc: ChatService) {}
}
