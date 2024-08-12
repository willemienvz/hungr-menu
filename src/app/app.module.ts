import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';
import { AboutComponent } from './components/about/about.component';
import { HelpComponent } from './components/help/help.component';
import { CallforserviceComponent } from './components/callforservice/callforservice.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import {MatIconModule} from '@angular/material/icon';

import { environment } from '../../environments/environment';
import { FooterComponent } from './components/footer/footer.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MainmenuComponent,
    AboutComponent,
    HelpComponent,
    CallforserviceComponent,
    FooterComponent,
    ItemDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'hungr-firebase-app'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatIconModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
