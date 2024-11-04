import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.scss'
})
export class ViewOrderComponent implements OnInit {
  order: any;
  items: any[] = [];
  totalAmount: number = 0;
  userID:string = '';
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
        console.log('orders', orders);
        this.order = orders[0];
        this.items =this.order.items;
        console.log('orders', this.items);
      });
  }

  goBack(){
    this.router.navigate([`/${this.holdIDRestaurant}`]);
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

  placeOrder() {
    if (this.order && this.order.orderId) {
      this.firestore.collection('orders').doc(this.order.orderId).update({ status: 'ordered' })
        .then(() => {
          console.log('Order status updated to ordered');
          this.router.navigate([`/${this.holdIDRestaurant}/order-placed`]);
        })
        .catch(error => {
          console.error('Error updating order status:', error);
        });
    }
  }
}
