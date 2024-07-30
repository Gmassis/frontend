import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public sessao: Map<string, any> = new Map();
}
