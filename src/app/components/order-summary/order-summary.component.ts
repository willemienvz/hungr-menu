import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  order: any;
  items: any[] = [];
  totalAmount: number = 0;
  orderID:string = '';
  totalNumber: number = 0;
  holdIDRestaurant:string = '';
  tipPercentage: number = 10;
  splitAmount: number = 0;
  quantity: number = 2;
  tempHoldToTals:number= 0;
  splitCount: number = 1;
  isSplitModalOpen: boolean = false;
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

  calculateTotal() :any{
    let totatl = 0;
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const price = parseFloat(item.price.replace('R ', ''));
      totatl += price;
    }

    totatl = totatl * (1+(this.tipPercentage/100));
    return totatl.toFixed(2);
  }

  openSplitModal() {
    this.isSplitModalOpen = true;
  }

  closeSplitModal() {
    this.isSplitModalOpen = false;
  }

  setSplitCount(count: number) {
    this.splitCount = count;
    this.splitAmount = this.calculateTotal() / count;
    this.closeSplitModal();
  }


  amountPerPerson(): string {
    const total = this.calculateTotal();
    console.log(total);
    const amount = total / this.splitCount;
    return amount.toFixed(2).toString();
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  next(){
    this.router.navigate([`/${this.holdIDRestaurant}/payment-method`]);
  }
}
