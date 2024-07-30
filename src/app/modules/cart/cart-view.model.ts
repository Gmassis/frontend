import { CardCartInputModel } from '../../shared/card-cart/card-cart-input.model';

export interface CartViewModel {
  title: string;
  profile: string;
  total: string;
  price: string;
  button: string;
  products: CardCartInputModel[];
}
