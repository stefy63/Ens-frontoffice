import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmRegistrationComponent } from './confirm-registration.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path     : 'success_registration/:key',
        component: ConfirmRegistrationComponent,
    }
];

@NgModule({
  declarations: [ConfirmRegistrationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule
  ]
})
export class ConfirmRegistrationModule { }
