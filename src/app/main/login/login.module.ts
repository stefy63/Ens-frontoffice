import { FuseSharedModule } from '@fuse/shared.module';
import { DialogForgotPassword } from './../home/dialog-component/forgot-password/dialog-forgot-password.component';
import { DialogRegistrationComponent } from './../home/dialog-component/registration/regstration.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseLoginComponent } from './login.component';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
    {
        path     : 'login',
        component: FuseLoginComponent
    }
];

@NgModule({
    declarations: [
        FuseLoginComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule,
        TranslateModule,
    ],
    entryComponents: [
        DialogRegistrationComponent,
        DialogForgotPassword
    ],
})

export class LoginModule
{
}
