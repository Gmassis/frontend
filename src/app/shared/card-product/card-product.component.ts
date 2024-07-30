import { Component, input, OnInit, output } from '@angular/core';
import { CardProductViewModel } from './card-product-view.model';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CardProductInputModel } from './card-product-input.model';

@Component({
  selector: 'app-card-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.scss',
})
export class CardProductComponent implements OnInit {
  public inputModel = input.required<CardProductInputModel>();
  public outputClick = output<string>();
  public viewModel!: CardProductViewModel;

  constructor(private ds: DomSanitizer) {}

  ngOnInit(): void {
    this.buildViewModel();
  }

  public onClickAddHandle(): void {
    this.outputClick.emit(this.inputModel()._id);
  }

  public buildNgClass(): string {
    return this.inputModel().size === 'small'
      ? 'card-product card-product--small'
      : 'card-product';
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
    };
  }
}
