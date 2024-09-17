import { Component, OnInit } from '@angular/core';
import { Branding } from '../../models/branding';
import { StateService } from '../../state.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Restaurant } from '../../models/restaurant';
import { Menu } from '../../models/menu';
import { Router } from '@angular/router';
import { User } from '../../models/user';

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

  constructor(private stateService: StateService, private firestore: AngularFirestore, private router: Router){
    
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      const segments = url.split('/');
      if (segments.length > 1) {
        this.id = segments[1]; 
        if (this.id){
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
  
  callForService(){
    this.showCalled=true;
    setTimeout(() => {
      this.showCalled = false;
    }, 5000);
    //implementation needed
   }

  private isBrandFullyPopulated(brand: Branding): boolean {
    return brand.backgroundColor !== undefined &&
           brand.imageUrl !== undefined 
  }
}
