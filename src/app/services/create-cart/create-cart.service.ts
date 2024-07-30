import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CreateCartService {
  constructor(private httpClient: HttpClient) {}

  public execute$(idUser: string, idProduct: string): Observable<unknown> {
    return this.httpClient.post(environment.api.createCart, {
      idUser,
      idProduct,
    });
  }
}
