import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  loadingTime: number = 3000;
  isVisibible: Boolean = true

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisibible = false;
    }, this.loadingTime);
  }
}
