import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterModule } from 'app/layout/components/footer/footer.module';
import { CageComponent } from './cage.component';
import { NavbarModule } from 'app/layout/components/navbar/navbar.module';

@NgModule({
    declarations: [
        CageComponent
    ],
    imports: [
        RouterModule,
        FooterModule,
        NavbarModule
    ],
    exports: [
        CageComponent
    ]
})
export class CageModule
{
}
