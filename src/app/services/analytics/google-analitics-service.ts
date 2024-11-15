import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';

declare let ga: Function;

@Injectable()
export class GoogleAnalyticsService {

  constructor() { 
    ga('create', environment.analyticsID, 'auto');
  }


   public eventEmitter(
        eventCategory: string,
        eventAction: string,
        eventLabel: string = null,
        eventValue: number = null
        ) {
            ga('send', 'event', {
                eventCategory: eventCategory,
                eventLabel: eventLabel,
                eventAction: eventAction,
                eventValue: eventValue
            });
        }

    public pageEmitter(page: string) {
        ga('set', 'page', page);
        ga('send', 'pageview');
    }

}