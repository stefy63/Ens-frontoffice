import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { MatGridListModule, MatCardModule, MatIconModule } from '@angular/material';
import { HomeComponent } from './home.component';

const routes = [
    {
        path     : 'home',
        component: HomeComponent
    }
];

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MatGridListModule,
        MatCardModule,
        MatIconModule,
    ],
    exports     : [
        HomeComponent
    ]
})

export class HomeModule
{
}
