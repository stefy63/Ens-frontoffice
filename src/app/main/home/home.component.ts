import { Component } from '@angular/core';


@Component({
    selector   : 'home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class HomeComponent
{
    public chatActive = true;
    public videochatActive = false;
    public smsActive = true;
    public emilActive = true;
    public telegramActive = true;

    constructor(
    )
    {  }

    public clickService(service: string): void {
        return;
    }
}
