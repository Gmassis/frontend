import { Component, input, OnInit, output } from '@angular/core';
import { CardCategoryViewModel } from './card-category-view.model';
import { CardCategoryInputModel } from './card-category-input.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-card-category',
  standalone: true,
  imports: [],
  templateUrl: './card-category.component.html',
  styleUrl: './card-category.component.scss',
})
export class CardCategoryComponent implements OnInit {
  public inputModel = input.required<CardCategoryInputModel>();
  public outputClick = output<string>();
  public viewModel!: CardCategoryViewModel;

  constructor(private ds: DomSanitizer) {}

  ngOnInit(): void {
    this.buildViewModel();
  }

  public onCardClickHandle(): void {
    this.outputClick.emit(this.inputModel().name);
  }

  private buildViewModel(): void {
    this.viewModel = {
      name: this.inputModel().name,
      image: this.ds.bypassSecurityTrustStyle(
        `url(${this.inputModel().image})`
      ),
    };
  }
}
