import { SafeUrl } from '@angular/platform-browser';

export interface CardProductViewModel {
  name: string;
  type: string;
  price: string;
  image: SafeUrl;
  backgroud: string;
  color: string;
}
