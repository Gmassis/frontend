import { Component, OnInit } from '@angular/core';
import { CardProfileComponent } from '../../shared/card-profile/card-profile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CardCartComponent } from '../../shared/card-cart/card-cart.component';
import { CartViewModel } from './cart-view.model';
import { CardCartInputModel } from '../../shared/card-cart/card-cart-input.model';
import { CommonModule } from '@angular/common';
import { ProductResponse } from '../../services/product/product.response';
import { StateService } from '../../services/state/state.service';
import { StateConstants } from '../../services/state/state.const';
import { DeleteCartService } from '../../services/delete-cart/delete-cart.service';
import { catchError, EMPTY, finalize, map, of, tap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserResponse } from '../../services/login/user.response';
import { CheckoutService } from '../../services/checkout/checkout.service';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutRequest } from '../../services/checkout/checkout-request';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    CardProfileComponent,
    CardCartComponent,
    MatSnackBarModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  public viewModel!: CartViewModel;
  private cart: ProductResponse[] = [];
  private products: CardCartInputModel[] = [];
  private user!: UserResponse;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private state: StateService,
    private deleteCart: DeleteCartService,
    private snackBar: MatSnackBar,
    private checkout: CheckoutService,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.initUser();
    this.initCart();
    this.buildProducts();
    this.buildViewModel();
    this.checkoutStripe();
  }

  public onClickPayHandle(): void {
    this.loading.ligar();

    this.checkout
      .execute$(this.buildCheckout())
      .pipe(
        map(async (res: any) => {
          const stripe = await loadStripe(
            'pk_test_51PfnA2Ege2iOMdioi5hmntnGRyrLBK1HA2h8BZyFijJ8Kf8Hx5j4tJcMqS8gjQwn7ITyvB4HH4D1ibi46wy8EO6L00jsY9k65a'
          );
          sessionStorage.setItem(StateConstants.CHECKOUT, 'checkout stripe');
          stripe?.redirectToCheckout({ sessionId: res.id });
        }),
        catchError((err) => {
          this.openSnackbar(
            `Error processing payment. Please check your information and try again.`
          );
          return EMPTY;
        }),
        finalize(() => {
          this.loading.desligar();
        })
      )
      .subscribe();
  }

  public onClickProfileHandle(): void {
    this.state.sessao.set(StateConstants.ORIGE_ROUTE, 'cart');
    this.router.navigate(['login']);
  }

  public onClickMoreHandle(cardCart: CardCartInputModel): void {
    const product = this.products.find((item) => item._id === cardCart._id);
    if (product) {
      product.quantity += 1;
      this.updateViewModel();
    }
  }

  public onClickLessHandle(cardCart: CardCartInputModel): void {
    const product = this.products.find((item) => item._id === cardCart._id)!;

    if (product.quantity > 0) product.quantity -= 1;
    if (product.quantity === 0) {
      if (!this.user || !this.user.id) return;
      this.deleteProductCart(this.user.id, product._id);
      return;
    }

    this.updateViewModel();
  }

  public onClickBack(): void {
    this.router.navigate(['home']);
  }

  private deleteProductCart(idUser: string, productId: string): void {
    this.deleteCart
      .execute$(idUser, productId)
      .pipe(
        tap((_) => {
          const index = this.products.findIndex((p) => p._id === productId);
          const product = this.products.find((p) => p._id === productId)!;
          this.products.splice(index, 1);
          this.updateViewModel();
          this.openSnackbar(`${product.name} has been removed from your cart.`);
        }),
        catchError((_) => {
          const product = this.products.find((p) => p._id === productId)!;
          product.quantity += 1;
          this.updateViewModel();
          this.openSnackbar(`Error removing product from your cart.`);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private buildViewModel(): void {
    this.viewModel = {
      title: 'My Cart',
      profile: this.user ? this.user.gender : 'FEMALE',
      total: 'Total:',
      price: `€${this.calculateTotalPrice()}`,
      button: 'Buy Now',
      products: this.products,
    };
  }

  private updateViewModel(): void {
    this.viewModel.products = this.products.map((product) => ({ ...product }));
    this.viewModel.price = `€${this.calculateTotalPrice()}`;
    this.state.sessao.set(StateConstants.CART, this.products);
  }

  private calculateTotalPrice(): string {
    return this.products
      .reduce((total, product) => total + product.price * product.quantity, 0)
      .toFixed(2);
  }

  private buildProducts(): void {
    const savedCart = this.state.sessao.get(StateConstants.CART);

    this.products = this.cart.map((product) => {
      const savedProduct = savedCart?.find(
        (p: CardCartInputModel) => p._id === product._id
      );

      return {
        _id: product._id,
        name: product.name,
        type: product.type,
        price: product.price,
        measurement_unit: product.measurement_unit,
        color: product.color,
        background: product.background,
        image: product.image,
        quantity: savedProduct ? savedProduct.quantity : 1,
      };
    });
  }

  private buildCheckout(): CheckoutRequest[] {
    return this.viewModel.products.map((product: CardCartInputModel) => ({
      name: product.name,
      unit_amount: product.price,
      quantity: product.quantity,
    }));
  }

  private initCart(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.cart = data['cart'];
    });
  }

  private openSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private initUser(): void {
    let user: UserResponse = this.state.sessao.get(StateConstants.USER);

    if (!user) {
      const userString = sessionStorage.getItem(StateConstants.USER);
      user = userString ? JSON.parse(userString) : null;
    }

    this.user = user;
  }

  private checkoutStripe(): void {
    const checkout = sessionStorage.getItem(StateConstants.CHECKOUT);
    if (!checkout) return;
    sessionStorage.removeItem(StateConstants.CHECKOUT);
    this.openSnackbar(`Payment has been canceled.`);
  }
}
