import { Component, OnInit } from '@angular/core';
import { CardCategoryComponent } from '../../shared/card-category/card-category.component';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { HomeViewModel } from './home-view.model';
import { ImagesConstants } from './images.const';
import { CommonModule } from '@angular/common';
import { CardProductComponent } from '../../shared/card-product/card-product.component';
import { CardProductInputModel } from '../../shared/card-product/card-product-input.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CardProfileComponent } from '../../shared/card-profile/card-profile.component';
import { ProductResponse } from '../../services/product/product.response';
import { CreateCartService } from '../../services/create-cart/create-cart.service';
import { StateService } from '../../services/state/state.service';
import { StateConstants } from '../../services/state/state.const';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InputComponent } from '../../shared/input/input.component';
import { UserResponse } from '../../services/login/user.response';
import { LoadingService } from '../../services/loading/loading.service';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { DeleteCartService } from '../../services/delete-cart/delete-cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    CardCategoryComponent,
    CardProductComponent,
    CardProfileComponent,
    InputComponent,
    MatSnackBarModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public viewModel!: HomeViewModel;

  private products: ProductResponse[] = [];
  private cart: ProductResponse[] = [];
  private user!: UserResponse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private createCartService: CreateCartService,
    private state: StateService,
    private snackBar: MatSnackBar,
    private loading: LoadingService,
    private deleteCartService: DeleteCartService
  ) {}

  ngOnInit(): void {
    this.initUser();
    this.initProducts();
    this.initCart();
    this.buildViewModel();
    this.checkoutStripe();
  }

  public onClickProfileHandle(): void {
    this.state.sessao.set(StateConstants.ORIGE_ROUTE, 'home');
    this.router.navigate(['login']);
  }

  public onClickAddHandle(idProduct: string): void {
    const existProductCart = this.cart.find(
      ({ _id }: ProductResponse) => idProduct === _id
    );

    if (existProductCart) {
      this.openSnackbar(`${existProductCart.name} is already in your cart.`);
      return;
    }

    if (!this.user || !this.user.id) {
      this.state.sessao.set(StateConstants.ORIGE_ROUTE, 'home');
      this.router.navigate(['login']);
      return;
    }

    this.loading.ligar();
    this.createCartService
      .execute$(this.user.id, idProduct)
      .pipe(
        tap((_) => {
          const product = this.products.find(
            ({ _id }: ProductResponse) => idProduct === _id
          )!;
          this.cart.push(product);
          this.viewModel = {
            ...this.viewModel,
            badge: this.viewModel.badge + 1,
          };
          this.openSnackbar(`${product.name} has been added to your cart.`);
        }),
        catchError((_) => {
          this.openSnackbar(`Error adding product to your cart.`);
          return EMPTY;
        }),
        finalize(() => {
          this.loading.desligar();
        })
      )
      .subscribe();
  }

  public onCardClickHandle(name: string): void {
    this.viewModel = { ...this.viewModel, valueSearch: name };
  }

  public onSearchHandle(value: string): void {
    const productsFilter = !value
      ? this.buildProducts()
      : this.filterAndBuildProducts(value);

    this.viewModel = { ...this.viewModel, products: productsFilter };
  }

  public onClickCartHandle(): void {
    this.router.navigate(['cart']);
  }

  public trackByFn(index: number, item: any): number {
    return item.id;
  }

  private buildViewModel(): void {
    this.viewModel = {
      categories: this.buildCategories(),
      products: this.buildProducts(),
      title: 'Popular Foodstuffs',
      badge: this.buildBadge(),
      valueSearch: '',
      profile: this.user ? this.user.gender : 'FEMALE',
    };
  }

  private buildProducts(): CardProductInputModel[] {
    return this.products.map((product, index) => {
      const size = index % 4 === 0 || index % 4 === 3 ? 'large' : 'small';

      return {
        _id: product._id,
        name: product.name,
        type: product.type,
        price: product.price,
        measurement_unit: product.measurement_unit,
        color: product.color,
        background: product.background,
        is_featured: product.is_featured,
        image: product.image,
        size: size,
      };
    });
  }

  private buildCategories() {
    return [
      {
        id: 1,
        name: 'Vegetables',
        image: ImagesConstants.VEGETABLES,
      },
      {
        id: 2,
        name: 'Fruits',
        image: ImagesConstants.FRUITS,
      },
      {
        id: 3,
        name: 'Greens',
        image: ImagesConstants.GREENS,
      },
      {
        id: 4,
        name: 'Mushrooms',
        image: ImagesConstants.MUSHROOMS,
      },
      {
        id: 4,
        name: 'Herbs',
        image: ImagesConstants.HERBS,
      },
    ];
  }

  private filterAndBuildProducts(valueSearch: string): CardProductInputModel[] {
    const filteredProducts = this.products.filter(
      ({ name, type }: any) =>
        this.removeAccents(name).includes(this.removeAccents(valueSearch)) ||
        this.removeAccents(type).includes(this.removeAccents(valueSearch))
    );

    return filteredProducts.map((product, index) => {
      const size = index % 4 === 0 || index % 4 === 3 ? 'large' : 'small';

      return {
        _id: product._id,
        name: product.name,
        type: product.type,
        price: product.price,
        measurement_unit: product.measurement_unit,
        color: product.color,
        background: product.background,
        is_featured: product.is_featured,
        image: product.image,
        size: size,
      };
    });
  }

  private removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private initProducts(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.products = data['products'];
    });
  }

  private initCart(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.cart = data['cart'];
    });
  }

  private buildBadge(): number {
    const uniqueProducts: ProductResponse[] = this.cart.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p._id === product._id)
    );

    return uniqueProducts.length;
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
    this.deleteCartService.execute$(this.user.id, '', true).subscribe();
    this.viewModel = { ...this.viewModel, badge: 0 };
    this.cart = [];
    this.openSnackbar(
      `Purchase completed successfully! Thank you for your order.`
    );
  }
}
