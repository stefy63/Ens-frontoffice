import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { PrivacyComponent } from './privacy.component';

const routes = [
    {
        path     : 'privacy',
        component: PrivacyComponent
    }
];


@NgModule({
    declarations: [
        PrivacyComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule,
    ],
    exports : [
        PrivacyComponent
    ]
})

export class PrivacyModule
{
}
