import { Component } from '@angular/core';

@Component({
    selector   : 'footer',
    templateUrl: './footer.component.html',
    styleUrls  : ['./footer.component.scss']
})
export class FooterComponent
{

    public appVersion = '5.0.0';

    /**
     * Constructor
     */
    constructor()
    {
    }
}
