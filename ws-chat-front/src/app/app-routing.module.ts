import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatsComponent } from './components/chats/chats.component';
import { LoginComponent } from './components/login/login.component';
import { PersonalMsgsComponent } from './components/personal-msgs/personal-msgs.component';
import { SystemMsgsComponent } from './components/system-msgs/system-msgs.component';
import { AuthorizedGuard } from './guards/authorized.guard';

const routes: Routes = [{
  path: '',
  redirectTo: '/login',
  pathMatch: 'full'
},{
  path: 'system-msgs',
  component: SystemMsgsComponent,
  canActivate: [AuthorizedGuard]
},{
  path: 'chats',
  component: ChatsComponent,
  canActivate: [AuthorizedGuard]
},{
  path: 'personal-msgs',
  component: PersonalMsgsComponent,
  canActivate: [AuthorizedGuard]
},{
  path: 'personal-msgs/:username',
  component: PersonalMsgsComponent,
  canActivate: [AuthorizedGuard]
},{
  path: 'login',
  component: LoginComponent
},{
  path: '**',
  redirectTo: '/login'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
