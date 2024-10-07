import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../state.service';
import { Menu } from '../../models/menu';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Restaurant } from '../../models/restaurant';
import { Branding } from '../../models/branding';
import { Location } from '@angular/common'

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent {
  item: any;
  activeMenu:Menu = {} as Menu;
  activeRestaurant:Restaurant = {} as Restaurant;
  brand:Branding = {} as Branding;
  isFavorited = false;
  constructor(private location: Location, private route: ActivatedRoute, private stateService: StateService,    private firestore: AngularFirestore,
    private router: Router) {}

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('itemId');
    const id = this.route.snapshot.paramMap.get('id') ;
    if (id && itemId) {
      this.fetchMenu(id, itemId);
    }
  }

  fetchMenu(id:string, itemId: string){
    this.firestore.collection<Restaurant>('restuarants', ref => ref.where('restaurantID', '==', id))
    .valueChanges()
    .subscribe(restaurant => {
      this.activeRestaurant = restaurant[0];
      this.stateService.setRestaurant(this.activeRestaurant);
      this.firestore.collection<Menu>('menus', ref => ref.where('menuID', '==', this.activeRestaurant.menuID))
      .valueChanges()
      .subscribe(menus => {
        this.activeMenu = menus[0];
        const itemIndex = parseInt(itemId, 10); 
        this.item = this.activeMenu.items[itemIndex]
        this.stateService.setMenu(this.activeMenu);
        console.log('activeMenu', this.activeMenu);
        console.log('item', this.item);
      });

      this.firestore.collection<Branding>('branding', ref => ref.where('parentID', '==', this.activeRestaurant.ownerID))
      .valueChanges()
      .subscribe(brand => {
        this.brand = brand[0];
        this.stateService.setBranding(this.brand);
        console.log('brand', this.brand);
      });
    });
  }

  back(): void {
    this.location.back()
  }

  /* favorite(){

  } */
}
