import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseProgressBarModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { HomeModule } from './main/home/home.module';
import { CageModule } from './layout/cage/cage.module';

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
        MDBBootstrapModule.forRoot(),
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
        HomeModule
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}