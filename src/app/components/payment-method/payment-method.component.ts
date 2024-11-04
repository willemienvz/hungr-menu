import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss'
})
export class PaymentMethodComponent implements OnInit{
  selectedOption: string = 'creditDebit'; 
  userID:string = '';
  orderID:string = '';
  holdIDRestaurant:string = '';

  constructor(private route: ActivatedRoute,private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')!;
      this.holdIDRestaurant = id;
      console.log(this.holdIDRestaurant);
    });
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  next() {
    switch (this.selectedOption) {
      case 'creditDebit':
        console.log(this.holdIDRestaurant);
        this.router.navigate([`/${this.holdIDRestaurant}/rate-your-meal`]);
        break;
      case 'snapScan':
        console.log('Navigating to SnapScan page...');
        this.router.navigate(['/snapscan-page']);
        break;
      case 'zapper':
        console.log('Navigating to Zapper page...');
        this.router.navigate(['/zapper-page']);
        break;
    }
  }

  goBack() {
    window.history.back();
  }
}
