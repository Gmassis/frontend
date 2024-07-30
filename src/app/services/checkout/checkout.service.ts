import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CheckoutRequest } from './checkout-request';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private readonly httpClient: HttpClient) {}

  public execute$(request: CheckoutRequest[]): Observable<unknown> {
    return this.httpClient.post(environment.api.checkout, request);
  }
}
