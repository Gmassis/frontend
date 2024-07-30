import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnChanges,
  output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements AfterViewInit, OnChanges {
  @ViewChild('inputSearch', { static: false }) inputSearch!: ElementRef;
  public value = input<string>('');
  public type = input<string>('search');
  public placeholder = input<string>('Search food');
  public valueOut = output<string>();
  public valueInput: string = '';

  constructor(private r2: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].isFirstChange()) {
      this.valueInput = this.value()!;
      this.emitValue(true);
    }
  }

  ngAfterViewInit(): void {
    this.eventClickKeyboard();

    if (this.value()) {
      this.valueInput = this.value()!;
    }
  }

  public buildNgClass(): string {
    return `input input--${this.type()}`;
  }

  public emitValue(isEnter: boolean = false): void {
    if (this.type() === 'search' && !isEnter) return;
    this.valueOut.emit(this.valueInput);
  }

  private eventClickKeyboard(): void {
    this.r2.listen(this.inputSearch.nativeElement, 'keydown.enter', () =>
      this.emitValue(true)
    );
  }
}
