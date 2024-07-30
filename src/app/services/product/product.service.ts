import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { ProductResponse } from './product.response';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  public execute$(is_featured: boolean = false): Observable<ProductResponse[]> {
    const httpParams = new HttpParams().append(
      'is_featured',
      is_featured.toString()
    );
    return this.httpClient
      .get<ProductResponse[]>(environment.api.getProduct, {
        params: httpParams,
      })
      .pipe(
        map((res) => res),
        catchError(() => of([]))
      );
  }
}
