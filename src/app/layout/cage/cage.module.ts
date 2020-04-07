import { FuseSharedModule } from './../../../@fuse/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterModule } from 'app/layout/components/footer/footer.module';
import { CageComponent } from './cage.component';
import { NavbarModule } from 'app/layout/components/navbar/navbar.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [
        CageComponent
    ],
    imports: [
        RouterModule,
        FooterModule,
        NavbarModule,
        NgxSpinnerModule,
        RouterModule,
        FuseSharedModule,
    ],
    exports: [
        CageComponent
    ]
})
export class CageModule
{
}
