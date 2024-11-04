import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'hungr-menu';
  isLoggedIn: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    const currentRestaurant = localStorage.getItem('restaurantID');
  
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      const idMatch = url.match(/\/([^/]+)/); 
      if (idMatch) {
        const id = idMatch[1]; 
        if (id !== currentRestaurant) {
          localStorage.setItem('restaurantID', id);
          localStorage.removeItem('orderID');
        } else {
          localStorage.setItem('restaurantID', id);
        }
      }
    });
  
    const isLoggedInString = localStorage.getItem('isLoggedIn');
    this.isLoggedIn = this.stringToBoolean(isLoggedInString);
  }

  stringToBoolean(str: string | null): boolean {
    return str !== null && ['true', 'yes', '1'].includes(str.toLowerCase());
  }
}
