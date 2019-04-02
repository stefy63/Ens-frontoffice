import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { GetBaseUrl } from 'app/helper/getBaseUrl';
import { IDataLogin } from 'app/interfaces/i-data-login';
import { map } from 'rxjs/operators';
import { IUser } from 'app/interfaces/i-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiForgotPasswordService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService
  ) { }

  public apiForgotPassword(dataLogin: IDataLogin): Observable<boolean> {
    return this.http.post(this.baseUrl + '/forgot_password', dataLogin).pipe(map(data => data as boolean));
  }

  public apiCangePassword(key: string): Observable<IUser> {
    return this.http.put(this.baseUrl + '/forgot_password/' + key, null).pipe(map(data => data as IUser));
  }

  public apiForgotPasswordTestKey(key: string): Observable<boolean> {
    return this.http.get(this.baseUrl + '/forgot_password/' + key, httpOptions).pipe(map(data => data as boolean));
  }
}
