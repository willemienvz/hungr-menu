import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { AboutComponent } from './components/about/about.component';
import { HelpComponent } from './components/help/help.component';
import { CallforserviceComponent } from './components/callforservice/callforservice.component';

const routes: Routes = [
  { path: ':id', component: MenuComponent },
  { path: '', redirectTo: '/1', pathMatch: 'full' }, // Default route
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpComponent },
  { path: 'call-for-service', component: CallforserviceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
