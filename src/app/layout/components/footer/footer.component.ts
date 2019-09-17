import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
    selector   : 'footer',
    templateUrl: './footer.component.html',
    styleUrls  : ['./footer.component.scss']
})
export class FooterComponent
{

    public appVersion = environment.version;

    /**
     * Constructor
     */
    constructor()
    {
    }

    public devHome() {
        window.open('http://www.3punto6.com', '_new');
    }
}
