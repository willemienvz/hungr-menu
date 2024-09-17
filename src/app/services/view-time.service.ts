import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Menu } from '../models/menu';
import { ViewingTime } from '../models/viewingTime';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViewTimeService {
  constructor(private firestore: AngularFirestore) {}

  recordViewingTime(userId: string, time: number): void {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const timestamp = now.toISOString();

    this.firestore.collection<Menu>('menus', ref => ref.where('menuID', '==', userId))
      .valueChanges()
      .pipe(take(1))  
      .subscribe(result => {
        const existingViewingTimes = Array.isArray(result[0].viewingTime) ? result[0].viewingTime : [];

        const newViewingTime = {
          time,
          hour,
          day,
          timestamp
        };

        const updatedViewingTimes = [...existingViewingTimes, newViewingTime];

        const data = {
          viewingTime: updatedViewingTimes  
        };

        this.firestore.doc(`menus/${userId}`).update(data)
          .then(() => {
            console.log('saved time');
          })
          .catch((error) => {
            console.error('Error updating user data:', error);
          });
      });
  }
}
