import { Component } from '@angular/core';
import { navigation } from 'src/app/app-routing.module';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  list = navigation;
}
