import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private $analytics: Analytics = inject(Analytics);

  sendAnalyticEvent(action: string, category: string, label: string) {
    logEvent(this.$analytics, action, {
      "category": category,
      "action": action,
      "label": label
    });
  }

  sendAnalyticPageView(path: string, title: string) {
    logEvent(this.$analytics, path, {
      "path": path,
      "title": title,
    });
  }
}
