import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HomeComponent } from './home.component';
import { DialogLogin } from './dialog-component/login/dialog-login.component';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path     : 'home',
        component: HomeComponent
    }
];

@NgModule({
    declarations: [
        HomeComponent,
        DialogLogin
    ],
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule,
        TranslateModule,
    ],
    entryComponents: [
        DialogLogin
    ],
    exports     : [
        HomeComponent
    ]
})

export class HomeModule
{
}
