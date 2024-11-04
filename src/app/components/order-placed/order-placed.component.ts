import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.component.html',
  styleUrl: './order-placed.component.scss'
})
export class OrderPlacedComponent {
  order: any;
  items: any[] = [];
  totalAmount: number = 0;
  orderID:string = '';
  totalNumber: number = 0;
  holdIDRestaurant:string = '';

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.orderID =localStorage.getItem('orderID') || '';
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')!;
      this.holdIDRestaurant = id;
    });
      this.firestore.collection<Order>('orders', ref => ref.where('orderId', '==', this.orderID))
      .valueChanges()
      .subscribe(orders => {
        this.order = orders[0];
        this.items =this.order.items;
        console.log(this.order);
      });
  }

  calculateTotal() {
    let totatl = 0;
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const price = parseFloat(item.price.replace('R ', ''));
      totatl += price;
    }
    return totatl;
  }

  backToMenu(){
    this.router.navigate([`/${this.holdIDRestaurant}`]);
  }

  payNow(){
    this.router.navigate([`/${this.holdIDRestaurant}/order-summary`]);
  }

}
