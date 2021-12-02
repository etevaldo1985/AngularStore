import { Item } from 'src/app/models/item';
import { Address } from './address';
export class Supplier {
  id: number;
  name: string;
  active: boolean;
  address: Address;
  document: string;
  phone: string;
  items: Item[];

}
