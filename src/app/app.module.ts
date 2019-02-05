import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { AuthService } from './auth/auth.service';
import { SocketService } from './services/socket/socket.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ApiLoginService } from './services/api/api-login.service';
import { SimpleNotificationsModule } from 'angular2-notifications';

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
        ApiLoginService
    ],
    bootstrap   : [
        AppComponent
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule
{
}
