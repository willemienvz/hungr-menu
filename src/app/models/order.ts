import { Item } from "./item"

export interface Order {
    tableId: string;
    orderId:string;
    users:string;
    items:Item[];
    status:string;
    
 }