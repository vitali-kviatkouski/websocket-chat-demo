import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-system-msgs',
  templateUrl: './system-msgs.component.html',
  styleUrls: ['./system-msgs.component.css']
})
export class SystemMsgsComponent implements OnInit {

  constructor(public chatSrc: ChatService) { }

  ngOnInit(): void {
  }

  callSupport() {
    this.chatSrc.sendSupportRequest();
  }
}
