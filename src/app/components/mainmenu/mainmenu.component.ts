import { Component, OnInit } from '@angular/core';
import { Branding } from '../../models/branding';
import { StateService } from '../../state.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Restaurant } from '../../models/restaurant';
import { Menu } from '../../models/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrl: './mainmenu.component.scss'
})
export class MainmenuComponent implements OnInit {
  isMenuOpen = false;
  brand: Branding = {} as Branding;
  activeRestaurant:Restaurant = {} as Restaurant;
  isLoading = true; 
  id!: string;

  aboutText = '';
  businessHours = '';
  email = '';
  cellphone = '';
  isBusinessHoursVisible = true;
  isContactDetailsVisible = true;
  mainImageUrl = '';
  additionalImageUrl = '';
  showCalled: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor(private route: ActivatedRoute,private stateService: StateService, private firestore: AngularFirestore, private router: Router,private notificationService: NotificationService){
    
  }

  ngOnInit(): void {
    const pathname = window.location.pathname;
    const parts = pathname.split('/').filter(Boolean); 
    this.id = parts[0];

    this.firestore.collection<Restaurant>('restuarants', ref => ref.where('restaurantID', '==', this.id))
    .valueChanges()
    .subscribe(restaurant => {
      this.activeRestaurant = restaurant[0];
      this.stateService.setRestaurant(this.activeRestaurant);

      this.firestore.collection<Branding>('branding', ref => ref.where('parentID', '==', this.activeRestaurant.ownerID))
      .valueChanges()
      .subscribe(brand => {
        this.brand = brand[0];
        this.stateService.setBranding(this.brand);
        console.log('brand', this.brand);
        this.isLoading=false;
      });
    });

  }
  
  callForService(){
    this.showCalled=true;
    this.notificationService.sendNotification(this.getRandomInt(1, 10).toString()).then(() => {
      console.log('Notification sent!');
      this.showCalled = false;
    });

   }

   private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private isBrandFullyPopulated(brand: Branding): boolean {
    return brand.backgroundColor !== undefined &&
           brand.imageUrl !== undefined 
  }
}
