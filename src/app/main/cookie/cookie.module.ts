import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { CookieComponent } from './cookie.component';

const routes = [
    {
        path     : 'cookie',
        component: CookieComponent
    }
];


@NgModule({
    declarations: [
        CookieComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule,
    ],
    exports : [
        CookieComponent
    ]
})

export class CookieModule
{
}
