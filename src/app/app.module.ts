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

const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'home'
    }
];

@NgModule({
    declarations: [
        AppComponent
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
        SimpleNotificationsModule.forRoot()
    ],
    providers: [
        ApiCalendarService,
        ApiTicketServiceService,
        AuthService,
        LocalStorageService,
        SocketService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        ApiLoginService,
        ApiUserService,
        ApiItalyGeoService,
        ApiTicketService,
        ApiTicketHistoryService
    ],
    bootstrap   : [
        AppComponent
    ],
    schemas: [ 
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule
{
}
