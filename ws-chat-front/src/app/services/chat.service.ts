import { Injectable } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Chat } from './chat.domain';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url: string = "http://localhost:8080";
  public chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
  public chatMsgs: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
  private stomp: CompatClient;
  public systemMsgs: string[] = [];
  public privateMsgs: string[] = [];
  public username!: string;
  
  constructor() { 
    // // TODO: change (refresh) UI if
    // // 1. Parent folder was deleted
    // // 2. Direct child was created/deleted/modified
    this.systemMsgs = [];
    console.log("Prep for connection");
     const socket = new SockJS(`${this.url}/chats-websocket`);
     this.stomp = Stomp.over(socket);
     this.stomp.debug = f => f;
     this.stomp.connect({}, () => {
      console.log("connected");      
      // handle personal system messages from other topics
      this.stomp.subscribe('/user/topic/chats/system', (msg)=> this.onSystemMessage(msg));
      // handle @SubscribeMapping handling
      this.stomp.subscribe('/app/chats/system', (msg)=> this.onSystemMessage(msg));
      // handle @MessageMapping return value
      this.stomp.subscribe('/topic/chats/system', (msg)=> this.onSystemMessage(msg));

      this.stomp.subscribe('/user/topic/private/messages', (msg)=> this.onPrivateMessage(msg));

      this.stomp.subscribe('/app/username', (message: any) => {
        this.username = message.body;
      });

      this.stomp.subscribe('/app/chats/all', (message: any) => {
        this.chats.next(JSON.parse(message.body));
        const payload = message.body;
        console.log("Got chats", payload);
      });
    });
  } 

  private onSystemMessage(message: any) {
    const payload = message.body;
    console.log("Got system personal message", payload);
    this.systemMsgs.push(payload);
  }

  private onPrivateMessage(message: any) {
    const payload = message.body;
    console.log("Got private personal message from another user: ", payload);
    this.privateMsgs.push(payload);
  }



  public subscribeToChat(id: number, handler: (msg: any) => void) {
    this.stomp.subscribe(`/app/chats/${id}`, (message: any) => {
      const messages: String[] = JSON.parse(message.body);
      handler(messages);
    });
    this.stomp.subscribe(`/topic/chats/${id}`, (message: any) => {
      console.log('Got message from subscription to /topic/chats ' + message.body);
      // not a json here
      const msg: String = message.body;
      handler(msg);
    });
  }

  public sendMsg(id: number, msg: string) {
    this.stomp.send(`/app/chats/${id}`, {}, msg);
  }

  public sendMsgDirectly(id: number, msg: string) {
    this.stomp.send(`/topic/chats/${id}`, {}, msg);
  }

  public sendMsgToUser(user: string, msg: string) {
    this.stomp.send(`/app/private/messages/${user}`, {}, msg);
  }

  public sendSupportRequest() {
    this.stomp.send('/app/chats/system', {}, 'support');
  }
}
