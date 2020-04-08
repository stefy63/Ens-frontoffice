import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { ForgotPasswordComponent } from './forgot-password.component';


const routes = [
    {
        path     : 'success_forgot/:key',
        component: ForgotPasswordComponent,
    }
];

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule
  ]
})
export class ForgotPasswordModule { }
