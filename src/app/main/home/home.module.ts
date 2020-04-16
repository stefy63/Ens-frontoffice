import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { DialogLogin } from './dialog-component/login/dialog-login.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { DialogRegistrationComponent } from './dialog-component/registration/regstration.component';
import { DialogNewTicket } from './dialog-component/new-ticket/dialog-new-ticket.component';
import { DialogQueue } from './dialog-component/queue/dialog-queue.component';
import { DialogForgotPassword } from './dialog-component/forgot-password/dialog-forgot-password.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const routes = [
    {
        path     : 'home',
        component: HomeComponent
    }
];


@NgModule({
    declarations: [
        HomeComponent,
        DialogLogin,
        DialogNewTicket,
        DialogQueue,
    ],
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule,
        TranslateModule,
        MatSnackBarModule
    ],
    entryComponents: [
        DialogLogin,
        DialogRegistrationComponent,
        DialogNewTicket,
        DialogQueue,
        DialogForgotPassword
    ],
    exports     : [
        HomeComponent
    ]
})

export class HomeModule
{
}
