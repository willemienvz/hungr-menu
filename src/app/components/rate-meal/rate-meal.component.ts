import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order';
import { MenuItem } from '../../models/menu-item';
import { Restaurant } from '../../models/restaurant';
import { Menu } from '../../models/menu';
import { Rating } from '../../models/rating';

@Component({
  selector: 'app-rate-meal',
  templateUrl: './rate-meal.component.html',
  styleUrl: './rate-meal.component.scss'
})
export class RateMealComponent implements OnInit{
  orderID:string = '';
  holdIDRestaurant:string = '';
  menuId:string='';
  order: any;
  items: any[] = [];
  activeRestaurant:Restaurant = {} as Restaurant;
  activeMenu:Menu = {} as Menu;


  mealItems: any[] = [
    { name: "Filter Coffee", imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/421951c47886891de7418a74b840b936bf1851c727c88f1bf114e81911574c3b?placeholderIfAbsent=true&apiKey=e267c502494249909854f49fe1d37e24" },
    { name: "Breakfast Bagel", imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6788025b3b8c11b6d0407b34dd1c5289d9edb19da34965b988e457fb6bb65e16?placeholderIfAbsent=true&apiKey=e267c502494249909854f49fe1d37e24" },
    { name: "Famous Giant Muffin", imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/b946e5237d7d572b7999649302cbc0611314aea325764ff8afc23fc55c575d2c?placeholderIfAbsent=true&apiKey=e267c502494249909854f49fe1d37e24" },
  ];

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.orderID =localStorage.getItem('orderID') || '';
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')!;
      this.holdIDRestaurant = id;
      this.fetchMenu(this.holdIDRestaurant);
    });
      this.firestore.collection<Order>('orders', ref => ref.where('orderId', '==', this.orderID))
      .valueChanges()
      .subscribe(orders => {
        this.order = orders[0];
        this.items =this.order.items;
        console.log(this.order);
      });
  }

  
  fetchMenu(id:string){
    this.firestore.collection<Restaurant>('restuarants', ref => ref.where('restaurantID', '==', id))
    .valueChanges()
    .subscribe(restaurant => {
      this.activeRestaurant = restaurant[0];
      this.menuId = this.activeRestaurant.menuID;
    });
  }

  onSkip(): void {
    this.router.navigate([`/${this.holdIDRestaurant}`]);
  }

  onFinish(): void {
    this.saveRatings();
  }

  toggleRating(item: MenuItem, rating: number) {
    item.rating = item.rating === rating ? 0 : rating;
  }

  private saveRatings() {
    this.items.forEach(item => {
      if (item.rating > 0) {
        const ratingData: Rating = {
          itemId: item.itemId,
          rating: item.rating,
        };
  
        this.firestore.collection<Rating>('ratings').add(ratingData)
          .then(() => {
            this.router.navigate([`/${this.holdIDRestaurant}`]);
            console.log(`Rating for item ${item.itemId} saved successfully.`);
          })
          .catch(error => {
            console.error(`Error saving rating for item ${item.itemId}:`, error);
          });
      }
    });
  }
}
