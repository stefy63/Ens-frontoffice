import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/auth/auth.service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { throwError } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private storage: LocalStorageService
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
                  window.open(environment.return_url, '_self');
                }
                return throwError(response);
              });
    }
    return next.handle(request);
  }
}
