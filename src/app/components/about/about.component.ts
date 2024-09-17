import { Component, OnInit } from '@angular/core';
import { Branding } from '../../models/branding';
import { User } from '../../models/user';
import { Restaurant } from '../../models/restaurant';
import { StateService } from '../../state.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit{
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor(private location: Location, private stateService: StateService, private firestore: AngularFirestore, private router: Router){
    
  }
  goBack(): void {
    this.location.back();
  }
  
  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      const segments = url.split('/');
      if (segments.length > 1) {
        this.id = segments[1]; 
        if (this.id){
          this.fetchMenu(this.id);
        }
        
      }
    });
   this.stateService.branding$.subscribe(branding => {
    this.brand = branding;
    

    if (this.isBrandFullyPopulated(this.brand)) {
      this.isLoading = false; 
    }
  });
  }

  fetchMenu(id:string){
    this.firestore.collection<Restaurant>('restuarants', ref => ref.where('restaurantID', '==', id))
    .valueChanges()
    .subscribe(restaurant => {
      this.activeRestaurant = restaurant[0];
      this.stateService.setRestaurant(this.activeRestaurant);
      console.log('activeRestaurant', this.activeRestaurant);

      this.firestore.collection<Branding>('branding', ref => ref.where('parentID', '==', this.activeRestaurant.ownerID))
      .valueChanges()
      .subscribe(brand => {
        this.brand = brand[0];
        this.stateService.setBranding(this.brand);
        console.log('brand', this.brand);
        this.isLoading=false;
      });

      this.fetchUsers();
    });

   
  }

  
  private fetchUsers() {
    this.firestore.collection<User>('users', ref => ref.where('uid', '==', this.activeRestaurant.ownerID))
      .valueChanges()
      .subscribe(result => {
        console.log('about: ',result);
        if (result.length > 0 && result[0].about) {
        
          this.aboutText = result[0].about.aboutText || '';
          this.businessHours = result[0].about.businessHours || '';
          this.email = result[0].about.email || '';
          this.cellphone = (result[0].about.cellphone || '').replace(/\s+/g, '');
          this.isBusinessHoursVisible = result[0].about.isBusinessHoursVisible ?? true;
          this.isContactDetailsVisible = result[0].about.isContactDetailsVisible ?? true;
          this.mainImageUrl = result[0].about.mainImageUrl || '';
          this.additionalImageUrl = result[0].about.additionalImageUrl || '';
        }
      });
  }

  private isBrandFullyPopulated(brand: Branding): boolean {
    return brand.backgroundColor !== undefined &&
           brand.imageUrl !== undefined 
  }
}
