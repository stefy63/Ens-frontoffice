import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { AuthGuard } from 'app/guard/auth.guard';
import { RouterModule } from '@angular/router';

const routes = [
    {
        path     : 'chat',
        component: ChatComponent,
        canActivate: [AuthGuard],
    }
];

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ChatModule { }
