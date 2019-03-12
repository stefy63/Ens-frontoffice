import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideochatComponent } from './videochat.component';
import { AuthGuard } from 'app/guard/auth.guard';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';


const routes = [
    {
        path     : 'videochat',
        component: VideochatComponent,
        canActivate: [AuthGuard],
    }
];


@NgModule({
  declarations: [VideochatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
  ]
})
export class VideochatModule { }
