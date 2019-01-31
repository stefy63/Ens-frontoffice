import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { NavbarComponent } from './navbar.component';


@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
    ],
    exports: [
        NavbarComponent
    ]
})
export class NavbarModule
{
}
