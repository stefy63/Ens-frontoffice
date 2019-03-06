import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitingComponent } from './waiting.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from 'app/guard/auth.guard';

const routes = [
    {
        path     : 'waiting',
        component: WaitingComponent,
        canActivate: [AuthGuard],
    }
];

@NgModule({
  declarations: [
      WaitingComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FuseSharedModule,
  ],
  exports: [
      WaitingComponent
  ]
})
export class WaitingModule { }
