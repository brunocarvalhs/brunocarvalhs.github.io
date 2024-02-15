import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'
import { FormsModule } from '@angular/forms';

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
    FormsModule,
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

  name = '';
  email = '';
  subject = '';
  message = '';

  onSubmit() {
    const mailtoLink = `mailto:${this.data.email}?name=${this.name}&email=${this.email}&subject=${this.subject}&body=${this.message}`;
    window.open(mailtoLink);
  }
}
