import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatsComponent } from './components/chats/chats.component';
import { PersonalMsgsComponent } from './components/personal-msgs/personal-msgs.component';
import { SystemMsgsComponent } from './components/system-msgs/system-msgs.component';

const routes: Routes = [{
  path: '',
  redirectTo: '/system-msgs',
  pathMatch: 'full'
},{
  path: 'system-msgs',
  component: SystemMsgsComponent
},{
  path: 'chats',
  component: ChatsComponent
},{
  path: 'personal-msgs',
  component: PersonalMsgsComponent
},{
  path: '**',
  redirectTo: '/system-msgs'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
