import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { LoadingService } from './services/loading/loading.service';
import { LoadingComponent } from './shared/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<boolean>();

  constructor(
    private readonly loadingService: LoadingService,
    private readonly router: Router
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.configurarTransicaoRotas();
  }

  private configurarTransicaoRotas(): void {
    this.router.events
      .pipe(
        takeUntil(this.unsubscribe),
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        )
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loadingService.ligar();
          return;
        }

        this.loadingService.desligar();
      });
  }
}
