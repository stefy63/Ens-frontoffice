import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from 'app/helper/getBaseUrl';
import { IChangePassword } from 'app/interfaces/i-change-password';
import { IUser } from 'app/interfaces/i-user';
import { map } from 'rxjs/operators';
import { User } from 'app/interfaces/i-user-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiUserService {

  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public apiChangePassword(user: IChangePassword): Observable<any> {
    return this.http.put(this.baseUrl + '/user/password/' + user.user_id, user);
  }

  public apiChangeProfile(user: IUser): Observable<any> {
    return this.http.put(this.baseUrl + '/user', user);
  }

  public apiCreateUser(user: User): Observable<any> {
    return this.http.post(this.baseUrl + '/user', user);
  }

  public apiConfirRegistration(key: string): Observable<boolean> {
    return this.http.put(this.baseUrl + '/user/confirm/' + key, null).pipe(map(data => data as boolean));
  }

}
