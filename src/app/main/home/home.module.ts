import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { DialogLogin } from './dialog-component/login/dialog-login.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { DialogRegistrationComponent } from './dialog-component/registration/regstration.component';
import { DialogNewTicket } from './dialog-component/new-ticket/dialog-new-ticket.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'app/interceptors/token.interceptor';
import { DialogQueue } from './dialog-component/queue/dialog-queue.component';

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
        DialogRegistrationComponent,
        DialogNewTicket,
        DialogQueue
    ],
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule,
        TranslateModule
    ],
    entryComponents: [
        DialogLogin,
        DialogRegistrationComponent,
        DialogNewTicket,
        DialogQueue
    ],
    exports     : [
        HomeComponent
    ]
})

export class HomeModule
{
}
