import { SafeUrl } from '@angular/platform-browser';

export interface CardCartViewModel {
  name: string;
  type: string;
  price: string;
  image: SafeUrl;
  backgroud: string;
  color: string;
  measurement_unit: string;
  quantity: number;
}
