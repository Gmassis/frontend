import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private httpClient: HttpClient) {}

  public execute$(
    name: string,
    email: string,
    pass: string,
    gender: string
  ): Observable<unknown> {
    return this.httpClient.post(environment.api.register, {
      name,
      email,
      pass,
      gender,
    });
  }
}
