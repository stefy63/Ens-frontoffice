import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { FooterComponent } from 'app/layout/components/footer/footer.component';
import { FuseSharedModule } from '../../../../@fuse/shared.module';

@NgModule({
    declarations: [
        FooterComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        FuseSharedModule,
    ],
    exports: [
        FooterComponent
    ]
})
export class FooterModule
{
}
