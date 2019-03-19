import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { AuthGuard } from 'app/guard/auth.guard';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgScrollbarModule } from 'ngx-scrollbar';

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
    FuseSharedModule,
    NgScrollbarModule
  ]
})
export class ChatModule { }
