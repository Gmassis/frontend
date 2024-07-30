import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  standalone: true,
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  public loadingModel = this.loadingService.obter();
  constructor(private readonly loadingService: LoadingService) {}
}
