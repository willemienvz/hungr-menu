import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation-dialog',
  templateUrl: './order-confirmation-dialog.component.html',
  styleUrls: ['./order-confirmation-dialog.component.scss']
})
export class OrderConfirmationDialogComponent {
  holdIDRestaurant:string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<OrderConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
   
  }
  
  
  closeDialog() {
    this.dialogRef.close();
  }

  backToMenu(){
    this.dialogRef.close();
    this.router.navigate([`/${this.data.id}`]);
  }

  viewOrder(){
    this.dialogRef.close();
    this.router.navigate([`/${this.data.id}/view-order`]);
    
  }
}
