import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
import { FuseModule } from '@fuse/fuse.module';
import { FuseProgressBarModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { HomeModule } from './main/home/home.module';
import { CageModule } from './layout/cage/cage.module';
import { ApiCalendarService } from './services/api/api-calendar-service';
import { ApiTicketServiceService } from './services/api/api-ticket-service-service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { SocketService } from './services/socket/socket.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ApiLoginService } from './services/api/api-login.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AuthService } from './services/auth/auth.service';
import { ApiUserService } from './services/api/api-user.service';
import { ApiItalyGeoService } from './services/api/api-italy-geo.service';
import { FuseSharedModule } from '@fuse/shared.module';
import { ApiTicketService } from './services/api/api-ticket.service';
import { ApiTicketHistoryService } from './services/api/api-ticket-history.service';
import { ApiQueueService } from './services/api/api-queue.service';
import { WaitingModule } from './main/waiting/waiting.module';
import { environment } from 'environments/environment';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AuthGuard } from './guard/auth.guard';
import { DialogConfirm } from './main/dialog-confirm/dialog-confirm.component';
import { ChatModule } from './main/chat/chat.module';
import { ChatService } from './services/api/chat-messages.service';
import { VideochatModule } from './main/videochat/videochat.module';
import { ForgotPasswordModule } from './main/forgot-password/forgot-password.module';
import { ApiForgotPasswordService } from './services/api/api-forgot-password.service';
import { ConfirmRegistrationModule } from './main/confirm-registration/confirm-registration.module';
import { GoogleAnalyticsService } from './services/analytics/google-analitics-service';
import { MatIconModule } from '@angular/material/icon';
import { CookieLawModule } from 'angular2-cookie-law';
import { CookieModule } from './main/coockie/cookie.module';
 
const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'home'
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
        AppComponent,
        DialogConfirm,
    ],
    imports     : [
        FuseSharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),
        // Material moment date module
        MatMomentDateModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        // App modules
        CageModule,
        HomeModule,
        WaitingModule,
        ChatModule,
        VideochatModule,
        CookieModule,
        ForgotPasswordModule,
        ConfirmRegistrationModule,
        SimpleNotificationsModule.forRoot(),
        SocketIoModule.forRoot(config),
        MatIconModule,
        CookieLawModule
    ],
    providers: [
        SocketService,
        ApiQueueService,
        ApiCalendarService,
        ApiTicketServiceService,
        AuthService,
        ApiForgotPasswordService,
        LocalStorageService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        ApiLoginService,
        ApiUserService,
        ApiItalyGeoService,
        ApiTicketService,
        ApiTicketHistoryService,
        ChatService,
        AuthGuard,
        GoogleAnalyticsService
    ],
    bootstrap   : [
        AppComponent
    ],
    schemas: [ 
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [
        DialogConfirm
    ]
})
export class AppModule
{
}
