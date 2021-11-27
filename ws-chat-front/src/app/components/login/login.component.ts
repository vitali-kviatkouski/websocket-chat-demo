import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  invalid: boolean = false;
  subscription!: Subscription;

  constructor(public chatSrc: ChatService, private router: Router) { }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.subscription = this.chatSrc.authorizationLog.subscribe(value => {
      this.invalid = !value;
      if (value) {
        this.router.navigate(['/system-msgs'])
      }
    });
  }

  public login(login: string, password: string) {
    this.chatSrc.login(login, password);
  }

}
