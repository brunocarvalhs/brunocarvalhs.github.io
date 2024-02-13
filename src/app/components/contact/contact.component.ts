import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'

interface Contact {
  email: String,
  phone: String,
  address: String,
  website: String
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  data: Contact = {
    email: "",
    address: "",
    phone: "",
    website: ""
  }
}
