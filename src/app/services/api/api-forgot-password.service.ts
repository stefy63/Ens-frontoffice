import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from 'app/helper/getBaseUrl';
import { map } from 'rxjs/operators';
import { IUser } from 'app/interfaces/i-user';
import { IForgotChangePassword } from 'app/interfaces/i-forgot-change-password';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiForgotPasswordService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public apiForgotPassword(dataLogin: string): Observable<boolean> {
    return this.http.post(this.baseUrl + '/forgot_password', {username: dataLogin}).pipe(map(data => data as boolean));
  }

  public apiCangePassword(key: string, body: IForgotChangePassword): Observable<IUser> {
    return this.http.put(this.baseUrl + '/forgot_password/' + key, body).pipe(map(data => data as IUser));
  }

  public apiForgotPasswordTestKey(key: string): Observable<boolean> {
    return this.http.get(this.baseUrl + '/forgot_password/' + key, httpOptions).pipe(map(data => data as boolean));
  }
}
