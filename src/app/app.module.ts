import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';
import { AboutComponent } from './components/about/about.component';
import { HelpComponent } from './components/help/help.component';
import { CallforserviceComponent } from './components/callforservice/callforservice.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MainmenuComponent,
    AboutComponent,
    HelpComponent,
    CallforserviceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
