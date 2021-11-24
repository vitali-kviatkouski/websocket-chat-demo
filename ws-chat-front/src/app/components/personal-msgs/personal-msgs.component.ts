import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-personal-msgs',
  templateUrl: './personal-msgs.component.html',
  styleUrls: ['./personal-msgs.component.css']
})
export class PersonalMsgsComponent implements OnInit {

  constructor(public chatSrc: ChatService) { }

  ngOnInit(): void {
  }

}
