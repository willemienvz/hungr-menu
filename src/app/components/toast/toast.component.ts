import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'] // corrected spelling here
})
export class ToastComponent implements OnInit, OnDestroy { // Implement OnInit and OnDestroy
  toast: ToastMessage | null = null;
  private subscription!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toast$.subscribe((toast) => {
      this.toast = toast;
      setTimeout(() => {
        this.toast = null;
      }, 3000); 
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
