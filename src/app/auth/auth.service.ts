import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { ITokenSession } from 'app/interfaces/i-token-session';

@Injectable()
export class AuthService {

  constructor(private storage: LocalStorageService) { }

  public getToken(): ITokenSession {
    const token =  this.storage.getItem('token');
    return (token) ? token : undefined;
  }

  public isAuthenticated(): boolean {
    const token: ITokenSession = this.getToken();
    return (!!token && moment().isSameOrBefore(token.token_expire_date));
  }

}
