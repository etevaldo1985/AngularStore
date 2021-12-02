
import { Supplier } from './supplier';
export class Item {
  id: number;
  name: string;
  model: string;
  price: number;
  costPrice: number;
  supplier: Supplier;
  image: string;
  imageUpload: string;
  active: boolean;
}
