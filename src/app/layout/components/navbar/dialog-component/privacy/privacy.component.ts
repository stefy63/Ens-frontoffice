import { GoogleAnalyticsService } from './../../../../../services/analytics/google-analitics-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class DialogPrivacyComponent implements OnInit {

  constructor(
      private googleAnalyticsService: GoogleAnalyticsService
  ) { }

  ngOnInit(): void {
    this.googleAnalyticsService.pageEmitter('PrivacyPage');
  }

}
