import { CardProductInputModel } from '../../shared/card-product/card-product-input.model';

export interface HomeViewModel {
  categories: Array<{
    id: number;
    name: string;
    image: string;
  }>;
  products: CardProductInputModel[];
  title: string;
  badge: number;
  valueSearch: string;
  profile: string;
}
