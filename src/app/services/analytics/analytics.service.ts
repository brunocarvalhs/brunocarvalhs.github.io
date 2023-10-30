import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private $analytics: GoogleAnalyticsService
  ) { }

  sendAnalyticEvent(action: string, category: string, label: string){
    this.$analytics.event(action, category, label)
  }

  sendAnalyticPageView(path: string, title: string){
    this.$analytics.pageView(path, title)
  }

}
