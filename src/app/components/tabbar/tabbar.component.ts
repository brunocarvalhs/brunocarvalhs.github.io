import { Component } from '@angular/core';
import { navigation } from 'src/app/app-routing.module';
import { faMobileButton } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss']
})
export class TabbarComponent {
  list = navigation;
  menuIcon = faMobileButton;
  showMenu = false;

  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }
}
