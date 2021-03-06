import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { Chat, Message } from './chat.domain';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private useSockJs: boolean = true;
  private sockJsUrl = environment.sockJsUrl;
  private websocketUrl = environment.websocketUrl;
  public chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
  public chatMsgs: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
  public authorizationLog: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private stomp!: Client;
  public systemMsgs: string[] = [];
  public privateMsgs: Message[] = [];
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
    this.privateMsgs.push(JSON.parse(payload));
  }



  public subscribeToChat(id: number, handler: (msg: any) => void): StompSubscription {
    this.stomp.subscribe(`/app/chats/${id}`, (message: any) => {
      const messages: string[] = JSON.parse(message.body);
      handler(messages);
    });
    return this.stomp.subscribe(`/topic/chats/${id}`, (message: any) => {
      console.log('Got message from subscription to /topic/chats ' + message.body);
      // not a json here
      const msg: string = message.body;
      handler(JSON.parse(msg));
    });
  }

  public sendMsg(id: number, msg: string) {
    this.sendMessage(`/app/chats/${id}`, msg);
  }

  public sendMsgDirectly(id: number, msg: string) {
    this.sendMessage(`/topic/chats/${id}`, `{"message": "${msg}"}`);
  }

  public sendMsgToUser(user: string | null, msg: string) {
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
