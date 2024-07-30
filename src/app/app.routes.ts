import { Routes } from '@angular/router';
import { ProductService } from './services/product/product.service';
import { inject } from '@angular/core';
import { RetrieveCartService } from './services/retrieve-cart/retrieve-cart.service';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'onboarding' },
  {
    path: 'home',
    loadComponent: () =>
      import('./modules/home/home.component').then((c) => c.HomeComponent),
    resolve: {
      products: () => inject(ProductService).execute$(),
      cart: () => inject(RetrieveCartService).execute$(),
    },
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./modules/onboarding/onboarding.component').then(
        (c) => c.OnboardingComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./modules/cart/cart.component').then((c) => c.CartComponent),
    resolve: {
      cart: () => inject(RetrieveCartService).execute$(),
    },
  },
];
