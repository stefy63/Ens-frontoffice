import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { AuthService } from 'app/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private storage: LocalStorageService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.getToken().token_session}`
        }
      });
      return next
              .handle(request)
              .catch(response => {
                if (response.status === 401) {
                  this.storage.clear();
                //   this.router.navigate(['pages/authentication/login-2']);
                }
                return Observable.throw(response);
              });
    }
    return next.handle(request);
  }
}
