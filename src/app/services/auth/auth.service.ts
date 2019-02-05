import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { ITokenSession } from 'app/interfaces/i-token-session';
import { Observable, ReplaySubject, Subject, BehaviorSubject } from 'rxjs';
import { IUser } from 'app/interfaces/i-user';
import { ApiLoginService } from '../api/api-login.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private replaySubject: Subject<ITokenSession | undefined>;

  constructor(private storage: LocalStorageService,
    private apiLoginService: ApiLoginService) { 
        this.replaySubject = new BehaviorSubject<any>(this.getToken());
    }

  public getToken(): ITokenSession | undefined {
    const token =  this.storage.getItem('token');
    return (token) ? token : undefined;
  }

  public isAuthenticated(): boolean {
    const token: ITokenSession = this.getToken();
    return (!!token && moment().isSameOrBefore(token.token_expire_date));
  }

  public login(dataLogin): any {
      this.apiLoginService.apiLogin(dataLogin).pipe(
          tap((data) => {
              /// next su replaySubject
              // save sul localStorage
          })
      );
  }

  public logout(): any {
    this.apiLoginService.apiLogout().pipe(
        tap((data) => {
            /// next su replaySubject (undefined)
            // remove dal localstorage
        })
    );
  }

  public change(): Subject<ITokenSession | undefined> {
      return this.replaySubject;
  }
}
