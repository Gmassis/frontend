import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ProductResponse } from '../product/product.response';
import { environment } from '../../../environment/environment';
import { StateService } from '../state/state.service';
import { UserResponse } from '../login/user.response';
import { StateConstants } from '../state/state.const';

@Injectable({
  providedIn: 'root',
})
export class RetrieveCartService {
  constructor(private httpClient: HttpClient, private state: StateService) {}

  public execute$(): Observable<ProductResponse[]> {
    let user: UserResponse = this.state.sessao.get(StateConstants.USER);
    if (!user) {
      const userString = sessionStorage.getItem(StateConstants.USER);
      user = userString ? JSON.parse(userString) : null;
    }

    if (!user || !user.id) return of([]);

    const httpParams = new HttpParams().append('idUser', user.id);
    return this.httpClient
      .get<ProductResponse[]>(environment.api.retrieveCart, {
        params: httpParams,
      })
      .pipe(
        map((res) => res),
        catchError(() => of([]))
      );
  }
}
