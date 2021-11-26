import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatService } from './services/chat.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SystemMsgsComponent } from './components/system-msgs/system-msgs.component';
import { ChatsComponent } from './components/chats/chats.component';
import { PersonalMsgsComponent } from './components/personal-msgs/personal-msgs.component';

@NgModule({
  declarations: [
    AppComponent,
    SystemMsgsComponent,
    ChatsComponent,
    PersonalMsgsComponent
  ],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
