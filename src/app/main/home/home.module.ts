import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HomeComponent } from './home.component';
import { DialogLogin } from './dialog-component/login/dialog-login.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { DialogRegistrationComponent } from './dialog-component/registration/regstration.component';
import { DialogNewTicket } from './dialog-component/new-ticket/dialog-new-ticket.component';
import { environment } from 'environments/environment';
import { SocketIoConfig, SocketIoModule } from 'ng-socket-io';
import { SocketService } from 'app/services/socket/socket.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'app/interceptors/token.interceptor';

const routes = [
    {
        path     : 'home',
        component: HomeComponent
    }
];

const options = {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity,
    multiplex: false,
    path: environment.ws_path,
    transports: ['websocket']
};

const wssPort =  (environment.ws_port) ? ':' + environment.ws_port : '';
const config: SocketIoConfig = { url: environment.ws_url + wssPort, options: options };

@NgModule({
    declarations: [
        HomeComponent,
        DialogLogin,
        DialogRegistrationComponent,
        DialogNewTicket
    ],
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule,
        TranslateModule,
        SocketIoModule.forRoot(config),
    ],
    entryComponents: [
        DialogLogin,
        DialogRegistrationComponent,
        DialogNewTicket
    ],
    exports     : [
        HomeComponent
    ],
    providers: [
        SocketService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
    ]
})

export class HomeModule
{
}
