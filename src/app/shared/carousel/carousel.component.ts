import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  delay,
  fromEvent,
  map,
  share,
  Subject,
  takeUntil,
  throttleTime,
} from 'rxjs';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @ViewChild('containerList', { static: false }) containerList!: ElementRef;
  private unsubscribe = new Subject<boolean>();

  ngAfterViewInit(): void {
    this.eventScrollHorizontal();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  private eventScrollHorizontal(): void {
    fromEvent(this.containerList.nativeElement, 'scroll')
      .pipe(
        takeUntil(this.unsubscribe),
        delay(1000),
        throttleTime(1000),
        map(() => this.getPositionHorizontal()),
        share()
      )
      .subscribe();

    fromEvent(this.containerList.nativeElement, 'scroll')
      .pipe(
        takeUntil(this.unsubscribe),
        map(() => this.containerList.nativeElement.scrollLeft),
        share()
      )
      .subscribe();
  }

  private getPositionHorizontal(): number {
    const elementHtml = this.containerList.nativeElement;
    const scrollMax = elementHtml.scrollWidth - elementHtml.offsetWidth;
    const scrollCurrent = elementHtml.scrollLeft;

    let percentageScroll = Math.ceil((scrollCurrent / scrollMax) * 100);
    if (percentageScroll < 0) {
      percentageScroll = 0;
    } else if (percentageScroll > 100) {
      percentageScroll = 100;
    }

    return percentageScroll;
  }
}
