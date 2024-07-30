import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DeleteCartService {
  constructor(private httpClient: HttpClient) {}

  public execute$(
    idUser: string,
    idProduct: string,
    deleteAllCart: boolean = false
  ): Observable<unknown> {
    const httpParams = new HttpParams()
      .append('idUser', idUser)
      .append('idProduct', idProduct)
      .append('deleteAllCart', deleteAllCart);
    return this.httpClient.delete(environment.api.deleteCart, {
      params: httpParams,
    });
  }
}
