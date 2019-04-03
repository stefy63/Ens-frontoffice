import { Component, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
    selector     : 'cage',
    templateUrl  : './cage.component.html',
    styleUrls    : ['./cage.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CageComponent
{
    public enableNav = true;

    constructor(private router: Router) {
        router.events.subscribe(event => {
            console.log(event);
            if(event instanceof NavigationStart) {
                if (event.url.includes('/success_forgot/')) {
                    this.enableNav = false;
                } else {
                    this.enableNav = true;
                }
                
            }
        });
    }
}
