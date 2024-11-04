import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../state.service';
import { Menu } from '../../models/menu';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Restaurant } from '../../models/restaurant';
import { Branding } from '../../models/branding';
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { SelectOptionsDialogComponent } from '../select-options-dialog/select-options-dialog.component';
import { Order } from '../../models/order';
import { Item } from '../../models/item';
import { Favorite } from '../../models/favourite';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent {
  mainId:string = '';
  item: any;
  activeMenu:Menu = {} as Menu;
  activeRestaurant:Restaurant = {} as Restaurant;
  brand:Branding = {} as Branding;
  isFavorited = false;
  allOrders:Order= {} as Order;

  constructor(private dialog: MatDialog,private location: Location, private route: ActivatedRoute, private stateService: StateService,    private firestore: AngularFirestore,
    private router: Router) {}

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('itemId');
    const id = this.route.snapshot.paramMap.get('id') ;
    if (id && itemId) {
      this.mainId = id;
      this.fetchMenu(id, itemId);
      this.checkFavourite(id, itemId);
    }
  }

  checkFavourite(itemId: string, userId: string) {
    this.firestore.collection('favourite', ref => 
      ref.where('itemId', '==', itemId).where('userId', '==', userId)
    )
    .get()
    .subscribe(snapshot => {
      if (!snapshot.empty) {
        console.log(`Item ${itemId} is favourited by user ${userId}.`);
        this.isFavorited= true;
      } else {
        this.isFavorited= false;
        console.log(`Item ${itemId} is not favourited by user ${userId}.`);
      }
    }, error => {
      console.error('Error checking favourite:', error);
    });
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
        const itemIndex = this.activeMenu.items.findIndex(item => item.itemId === itemId);
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
  addToOrder(item: any) {
    const hasOptions = item.sides.length > 0 || item.variations.length > 0 ||
                       item.pairings.length > 0 || item.preparations.length > 0;

    if (hasOptions) {
      // Open dialog for option selection if options are available
      const dialogRef = this.dialog.open(SelectOptionsDialogComponent, {
        data: {
          variations: item.variations,
          sides: item.sides,
          pairings: item.pairings,
          preparations: item.preparations
        }
      });

      dialogRef.afterClosed().subscribe(selectedOptions => {
        if (selectedOptions) {
          this.confirmOrder(item, selectedOptions);
        }
      });
    } else {
      let selectedOptions = {
        variation: null,
        side: null,
        preparation: null
      };
      this.confirmOrder(item, selectedOptions);
    }
  }

  confirmOrder(item: any, options: any) {
   
    const userId = JSON.parse(localStorage.getItem('user')!)?.uid || 'no-user';
    const orderId = localStorage.getItem('orderID'); 
    const itemId = item.itemId; 
    
    if (orderId) {
      const orderRef = this.firestore.collection('orders').doc(orderId);
  
      // Fetch the current order document once
      orderRef.get().subscribe(doc => {
        if (doc.exists) {
          this.allOrders = doc.data() as Order;
          
          const orderItem: Item = {
            orderId: orderId,
            itemId: itemId,
            name: item.name,
            price: item.price,
            quantity: 1,
            addedBy: userId,
            variation: options?.variation || '',
            side: options?.side || '',
            preparation: options?.preparation || '',
            itemStatus: 'new', 
            timeOrdered: new Date(),
            uniqueID:uuidv4()
          };
  

         

          this.allOrders.items = this.allOrders.items || [];
          this.allOrders.items.push(orderItem);
          console.log(this.allOrders);

          // Update Firestore with the updated items array
          orderRef.update({ items: this.allOrders.items })
          .then(() => {
            console.log('Order item added and status updated to active');
            this.router.navigate([`/${this.activeRestaurant.restaurantID}/view-order`]);
          })
          .catch(error => {
            console.error('Error updating order status:', error);
          });
        } else {
          console.error('Order not found.');
        }
      });
    }
  }

  favorite() {
    const userId = JSON.parse(localStorage.getItem('user')!)?.uid;
    const itemId = this.item.itemId;
  
    this.firestore.collection('favorite', ref => 
      ref.where('itemId', '==', itemId).where('userId', '==', userId)
    )
    .get()
    .subscribe(snapshot => {
      if (!snapshot.empty) {
        // Document exists, so delete it
        snapshot.forEach(doc => {
          this.firestore.collection('favorite').doc(doc.id).delete()
            .then(() => {
              console.log(`Favorite removed for item ${itemId}`);
            })
            .catch(error => {
              console.error(`Error removing favorite:`, error);
            });
        });
      } else {
        // Document does not exist, so add it
        const data: Favorite = { itemId: itemId, userId: userId };
        this.firestore.collection<Favorite>('favorite').add(data)
          .then(() => {
            console.log(`Item favorited with itemId: ${itemId}`);
          })
          .catch(error => {
            console.error(`Error adding favorite:`, error);
          });
      }
    }, error => {
      console.error('Error checking favorite:', error);
    });
  }
  
}
