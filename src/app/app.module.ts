import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FuseProgressBarModule } from '@fuse/components';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CookieLawModule } from 'angular2-cookie-law';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AppComponent } from 'app/app.component';
import { fuseConfig } from 'app/fuse-config';
import { environment } from 'environments/environment';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ErrorMessageTranslatorService } from './ErrorMessageTranslatorService';
import { AuthGuard } from './guard/auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { CageModule } from './layout/cage/cage.module';
import { ChatModule } from './main/chat/chat.module';
import { ConfirmRegistrationModule } from './main/confirm-registration/confirm-registration.module';
import { CookieModule } from './main/cookie/cookie.module';
import { DialogConfirm } from './main/dialog-confirm/dialog-confirm.component';
import { ForgotPasswordModule } from './main/forgot-password/forgot-password.module';
import { DialogForgotPassword } from './main/home/dialog-component/forgot-password/dialog-forgot-password.component';
import { DialogRegistrationComponent } from './main/home/dialog-component/registration/regstration.component';
import { HomeModule } from './main/home/home.module';
import { LoginModule } from './main/login/login.module';
import { PrivacyModule } from './main/privacy/privacy.module';
import { VideochatModule } from './main/videochat/videochat.module';
import { WaitingModule } from './main/waiting/waiting.module';
import { GoogleAnalyticsService } from './services/analytics/google-analitics-service';
import { ApiCalendarService } from './services/api/api-calendar-service';
import { ApiForgotPasswordService } from './services/api/api-forgot-password.service';
import { ApiItalyGeoService } from './services/api/api-italy-geo.service';
import { ApiLoginService } from './services/api/api-login.service';
import { ApiQueueService } from './services/api/api-queue.service';
import { ApiTicketHistoryService } from './services/api/api-ticket-history.service';
import { ApiTicketServiceService } from './services/api/api-ticket-service-service';
import { ApiTicketService } from './services/api/api-ticket.service';
import { ApiUserService } from './services/api/api-user.service';
import { ChatService } from './services/api/chat-messages.service';
import { AuthService } from './services/auth/auth.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { SocketService } from './services/socket/socket.service';


 
const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'login'
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
        DialogForgotPassword,
        DialogRegistrationComponent,
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
        LoginModule,
        WaitingModule,
        ChatModule,
        VideochatModule,
        CookieModule,
        ForgotPasswordModule,
        ConfirmRegistrationModule,
        SimpleNotificationsModule.forRoot(),
        SocketIoModule.forRoot(config),
        MatIconModule,
        CookieLawModule,
        PrivacyModule
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
        GoogleAnalyticsService,
        Title,
        ErrorMessageTranslatorService
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
