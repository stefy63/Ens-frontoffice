import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'app/services/auth/auth.service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private storage: LocalStorageService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> |  boolean {
      if (!this.auth.isAuthenticated()) {
        this.storage.clear();
        this.router.navigate(['home']);
        return false;
      }
      return true;
  }
}
