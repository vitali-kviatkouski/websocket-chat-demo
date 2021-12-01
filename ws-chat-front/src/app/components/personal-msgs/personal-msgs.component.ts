import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-personal-msgs',
  templateUrl: './personal-msgs.component.html',
  styleUrls: ['./personal-msgs.component.css']
})
export class PersonalMsgsComponent implements OnInit {

  username: string | null;

  constructor(public chatSrc: ChatService,
              route: ActivatedRoute) {
    this.username = route.snapshot.params['username'] ?? null;
  }

  ngOnInit(): void {
  }

}
