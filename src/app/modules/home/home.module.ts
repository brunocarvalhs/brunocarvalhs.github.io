import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { PresentationComponent } from './components/presentation/presentation.component';

@NgModule({
  declarations: [PresentationComponent, HomeComponent],
  imports: [CommonModule],
  bootstrap: [HomeComponent],
})
export class HomeModule {}
