import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


interface Item {
  name: string;
  description: string;
}

interface Data {
  [key: number]: Item;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data: Data = {
    1: { name: 'Item 1', description: 'Description for Item 1' },
    2: { name: 'Item 2', description: 'Description for Item 2' },
    3: { name: 'Item 3', description: 'Description for Item 3' }
  };

  constructor() { }

  getDataById(id: number): Observable<Item | undefined> {
    return of(this.data[id]);
  }
}
