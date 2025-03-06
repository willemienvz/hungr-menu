import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { ImgSliderComponent } from './components/img-slider/img-slider.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignupComponent } from './components/sign-up/sign-up.component';
import { ToastComponent } from './components/toast/toast.component';
import { NoMenuComponent } from './components/no-menu/no-menu.component';
import { SelectTableDialogComponent } from './components/select-table-dialog/select-table-dialog.component';
import { SelectOptionsDialogComponent } from './components/select-options-dialog/select-options-dialog.component';
import { OrderConfirmationDialogComponent } from './components/order-confirmation-dialog/order-confirmation-dialog.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OrderPlacedComponent } from './components/order-placed/order-placed.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { CardPaymentComponent } from './components/card-payment/card-payment.component';
import { RateMealComponent } from './components/rate-meal/rate-meal.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MainmenuComponent,
    AboutComponent,
    HelpComponent,
    CallforserviceComponent,
    FooterComponent,
    ItemDetailComponent,
    ImgSliderComponent,
    SignInComponent,
    SignupComponent,
    ToastComponent,
    NoMenuComponent,
    SelectTableDialogComponent,
    SelectOptionsDialogComponent,
    OrderConfirmationDialogComponent,
    ProfileMenuComponent,
    ViewOrderComponent,
    OrderPlacedComponent,
    OrderSummaryComponent,
    PaymentMethodComponent,
    CardPaymentComponent,
    RateMealComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'hungr-firebase-app'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
