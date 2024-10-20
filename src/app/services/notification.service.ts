import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private firestore: AngularFirestore) {}

  sendNotification(message: string) {
    return this.firestore.collection('notifications').add({
      message: message,
      timestamp: new Date(),
    });
  }
}
