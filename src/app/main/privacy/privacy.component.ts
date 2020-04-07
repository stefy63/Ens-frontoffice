import { GoogleAnalyticsService } from '../../services/analytics/google-analitics-service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
    
    constructor(
        private googleAnalyticsService: GoogleAnalyticsService
     ) { }

     ngOnInit() {
         this.googleAnalyticsService.pageEmitter('PrivacyPolicyPage');
     }
}
