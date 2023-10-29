import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

interface Navigation {
  path: String;
  name: String;
}

const routes: Routes = [{ path: '', component: HomeComponent }];

export const navigation: [Navigation] = [{ path: '', name: 'Home' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
