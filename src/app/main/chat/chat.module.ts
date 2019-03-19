import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { AuthGuard } from 'app/guard/auth.guard';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path     : 'chat/:id',
        component: ChatComponent,
        canActivate: [AuthGuard],
    }
];

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule
  ]
})
export class ChatModule { }
