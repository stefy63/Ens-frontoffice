import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { AuthGuard } from 'app/guard/auth.guard';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

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
    FuseSharedModule,
    SweetAlert2Module.forRoot({
        buttonsStyling: false,
        customClass: 'modal-content',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-danger'
    })
  ]
})
export class ChatModule { }
