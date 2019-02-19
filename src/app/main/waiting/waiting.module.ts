import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitingComponent } from './waiting.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path     : 'waiting',
        component: WaitingComponent
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
