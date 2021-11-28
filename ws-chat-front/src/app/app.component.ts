import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatState } from './services/chat.domain';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ws-chat-front';

  constructor(public chatSrc: ChatService,
              private router: Router) {}

  logout() {
    this.chatSrc.logout();
    this.chatSrc.username = null;
    this.gotoLogin();
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
