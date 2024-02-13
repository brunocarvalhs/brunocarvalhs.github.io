import { Component } from '@angular/core';

interface UserInfo {
  fullName: string;
  profession: string;
  birthDate: string;
  address: string;
  zipCode: string;
  email: string;
  phone: string;
  projectCompleted: number;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  userInfo: UserInfo = {
    fullName: 'Clark Thompson',
    profession: 'Web Developer',
    birthDate: 'January 01, 1987',
    address: 'San Francisco CA 97987 USA',
    zipCode: '1000',
    email: 'clarkthompgmail.com',
    phone: '+1-2234-5678-9-0',
    projectCompleted: 120
  };


}
