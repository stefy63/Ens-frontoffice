import { GoogleAnalyticsService } from './../../services/analytics/google-analitics-service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'cookie',
    templateUrl: './cookie.component.html',
    styleUrls: ['./cookie.component.scss']
})
export class CookieComponent implements OnInit {
    
    constructor(
        private googleAnalyticsService: GoogleAnalyticsService
     ) { }

     ngOnInit() {
         this.googleAnalyticsService.pageEmitter('CookiePolicyPage');
     }
}
