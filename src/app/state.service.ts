// state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu } from './models/menu';
import { Restaurant } from './models/restaurant';
import { Branding } from './models/branding';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private menuSubject = new BehaviorSubject<Menu>({} as Menu);
  private restaurantSubject = new BehaviorSubject<Restaurant>({} as Restaurant);
  private brandingSubject = new BehaviorSubject<Branding>({} as Branding);

  menu$ = this.menuSubject.asObservable();
  restaurant$ = this.restaurantSubject.asObservable();
  branding$ = this.brandingSubject.asObservable();

  setMenu(menu: Menu): void {
    this.menuSubject.next(menu);
  }

  setRestaurant(restaurant: Restaurant): void {
    this.restaurantSubject.next(restaurant);
  }

  setBranding(branding: Branding): void {
    this.brandingSubject.next(branding);
  }

  getMenu(): Menu {
    return this.menuSubject.value;
  }

  getRestaurant(): Restaurant {
    return this.restaurantSubject.value;
  }

  getBranding(): Branding {
    return this.brandingSubject.value;
  }
}
