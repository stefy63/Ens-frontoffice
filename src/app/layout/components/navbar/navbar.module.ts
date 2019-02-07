import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { NavbarComponent } from './navbar.component';
import { DialogChangePassword } from './dialog-component/change-password/dialog-change-password.component';
import { DialogProfileComponent } from './dialog-component/profile/profile.component';
import { FuseSharedModule } from '@fuse/shared.module';


@NgModule({
    declarations: [
        NavbarComponent,
        DialogChangePassword,
        DialogProfileComponent
    ],
    imports: [
        FuseSharedModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
    ],
    exports: [
        NavbarComponent
    ],
    entryComponents: [
        DialogChangePassword,
        DialogProfileComponent
    ],
})
export class NavbarModule
{
}
