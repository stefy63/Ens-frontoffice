import { GoogleAnalyticsService } from './../../../../../services/analytics/google-analitics-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class DialogConditionComponent implements OnInit {

  constructor(
      private googleAnalyticsService: GoogleAnalyticsService
  ) { }

  ngOnInit(): void {
    this.googleAnalyticsService.pageEmitter('TermAndConditionPage');
  }

}
