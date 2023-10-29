import { Component } from '@angular/core';
import { navigation } from 'src/app/app-routing.module';

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss']
})
export class TabbarComponent {
  list = navigation;
}
