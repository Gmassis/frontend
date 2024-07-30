import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { UserResponse } from './user.response';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  public execute$(email: string, pass: string): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(environment.api.login, {
      email,
      pass,
    });
  }
}
