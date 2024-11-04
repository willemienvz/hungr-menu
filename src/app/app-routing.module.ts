import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { AboutComponent } from './components/about/about.component';
import { HelpComponent } from './components/help/help.component';
import { CallforserviceComponent } from './components/callforservice/callforservice.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignupComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './guards/auth.guard';
import { NoMenuComponent } from './components/no-menu/no-menu.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';
import { OrderPlacedComponent } from './components/order-placed/order-placed.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { RateMealComponent } from './components/rate-meal/rate-meal.component';

const routes: Routes = [
  { path: 'no-menu', component: NoMenuComponent },
  { path: ':id/login', component: SignInComponent },
  { path: ':id/signup', component: SignupComponent },
  
  // Menu page - no child routes
  { path: ':id', component: MenuComponent, canActivate: [AuthGuard] },

  // Independent, guarded routes
  { path: ':id/about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: ':id/profile', component: ProfileMenuComponent, canActivate: [AuthGuard] },
  { path: ':id/help', component: HelpComponent, canActivate: [AuthGuard] },
  { path: ':id/call-for-service', component: CallforserviceComponent, canActivate: [AuthGuard] },
  { path: ':id/view-order', component: ViewOrderComponent, canActivate: [AuthGuard] },
  { path: ':id/order-placed', component: OrderPlacedComponent, canActivate: [AuthGuard] },
  { path: ':id/order-summary', component: OrderSummaryComponent, canActivate: [AuthGuard] },
  { path: ':id/payment-method', component: PaymentMethodComponent, canActivate: [AuthGuard] },
  { path: ':id/rate-your-meal', component: RateMealComponent, canActivate: [AuthGuard] },
  { path: ':id/items/:itemId', component: ItemDetailComponent, canActivate: [AuthGuard] },


  // Default and wildcard routes
  { path: '', redirectTo: '/no-menu', pathMatch: 'full' },
  { path: '**', redirectTo: '/no-menu' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
