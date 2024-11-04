import { Category } from "./category";

export interface MenuItem {
  itemId:string;
  categoryId: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  preparations: string[];
  variations: string[];
  pairings: string[];
  sides: string[];
  labels: string;
  showLabelInput: boolean;
  displayDetails: {
      preparation: boolean;
      variation: boolean;
      pairing: boolean;
      side: boolean;
  };
  favoritedBy?: string[];
  rating: number;
}