import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Chat } from './chat.domain';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private useSockJs: boolean = true;
  private sockJsUrl = "http://localhost:8080";
  private websocketUrl = "ws://localhost:8080";
  public chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
  public chatMsgs: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
  public authorizationLog: Subject<boolean> = new Subject<boolean>();
  private stomp!: Client;
  public systemMsgs: string[] = [];
  public privateMsgs: string[] = [];
  public username!: string | null;
  
  public login(login: string, password: string) {
     //const socket = new SockJS(`${this.url}/chats-websocket?login=${login}&password=${password}`);
     //this.stomp = Stomp.over(socket);
    const socket = `${this.useSockJs ? this.sockJsUrl : this.websocketUrl}/chats-websocket?login=${login}&password=${password}`;
    if (this.stomp != null) {
      this.logout();
    }
    this.stomp = new Client({webSocketFactory: () => {
      if (this.useSockJs) {
        return new SockJS(socket);
      } else {
        return new WebSocket(socket);
      }
    }});
    //this.stomp.debug = f => f;
    this.stomp.onConnect = () => {      
      console.log("connected");      
      this.stomp.subscribe('/app/login', (msg)=> this.authorizationLog.next(msg.body==="true"));

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
    };
    this.stomp.activate();
  }

  public logout() {
    this.stomp.deactivate();
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
    this.sendMessage(`/app/chats/${id}`, msg);
  }

  public sendMsgDirectly(id: number, msg: string) {
    this.sendMessage(`/topic/chats/${id}`, msg);
  }

  public sendMsgToUser(user: string, msg: string) {
    this.sendMessage(`/app/private/messages/${user}`, msg);
  }

  public sendSupportRequest() {
    this.sendMessage('/app/chats/system', 'support');
  }

  public sendSystemMessage(msg: string) {
    this.sendMessage('/app/chats/system', msg);
  }

  private sendMessage(topic: string, msg: string) {
    this.stomp.publish({destination: topic, body: msg});
  }

}
