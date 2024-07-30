import { Injectable, Signal, signal } from '@angular/core';
import { LoadingModel } from './loading.model';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingModel = signal<LoadingModel>({
    status: false,
    mensagem: 'Por favor, aguarde...',
  });

  public ligar(): void {
    this.loadingModel.update((model: LoadingModel) => {
      return { mensagem: model.mensagem, status: true };
    });
  }

  public desligar(): void {
    this.loadingModel.update((model: LoadingModel) => ({
      ...model,
      status: false,
    }));
  }

  public obter(): Signal<LoadingModel> {
    return this.loadingModel.asReadonly();
  }
}
