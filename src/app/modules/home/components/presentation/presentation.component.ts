import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

interface User {
  name: string,
};

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent {
  firestore: Firestore = inject(Firestore);

  constructor() {
    const itemCollection = collection(this.firestore, 'users');
  }
}
