import {
  Component,
  input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges,
} from '@angular/core';
import { CardCartViewModel } from './card-cart-view.model';
import { CardCartInputModel } from './card-cart-input.model';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-cart.component.html',
  styleUrl: './card-cart.component.scss',
})
export class CardCartComponent implements OnInit, OnChanges {
  public inputModel = input.required<CardCartInputModel>();
  public outputMoreClick = output<CardCartInputModel>();
  public outputLessClick = output<CardCartInputModel>();
  public viewModel!: CardCartViewModel;

  constructor(private ds: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputModel'].isFirstChange()) return;
    this.buildViewModel();
  }

  ngOnInit(): void {
    this.buildViewModel();
  }

  public onClickMoreHandle(): void {
    this.outputMoreClick.emit(this.inputModel());
  }

  public onClickLessHandle(): void {
    this.outputLessClick.emit(this.inputModel());
  }

  private buildViewModel(): void {
    this.viewModel = {
      name: this.inputModel().name,
      type: this.inputModel().type,
      price: `€${this.inputModel().price.toFixed(2)}`,
      image: this.ds.bypassSecurityTrustStyle(
        `url(${this.inputModel().image})`
      ),
      backgroud: this.inputModel().background,
      color: this.inputModel().color,
      measurement_unit: `(${this.inputModel().measurement_unit})`,
      quantity: this.inputModel().quantity,
    };
  }
}
