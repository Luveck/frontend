import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private excludedRoutes: string[] = ['/admin/panelControl', 'combo'];
  constructor(
    private readonly sessionService: SessionService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentRoute = state.url.split('?')[0];
    const token = this.sessionService.getToken();

    if (this.excludedRoutes.includes(currentRoute)) {
      return true;
    }

    if (token) {
      const expToken = this.sessionService.getExpToken();

      if (this.authService.checkTokenDate(expToken)) {
        this.sessionService.clearSession();
        this.authService.showSesionEndModal();
        return false;
      }

      if (this.sessionService.getUserData().Role === 'Cliente') {
        this.router.navigate(['authentication/noauthorized']);
        return false;
      }

      return true;
    }

    this.router.navigate(['authentication/login']);
    return false;

    // if (this.sessionService.getToken()) {
    //   if (this.sessionService.getUserData().Role === 'Cliente') {
    //     this.router.navigate(['authentication/noauthorized']);
    //     return false;
    //   }
    //   return true;
    // }
    // this.router.navigate(['authentication/login']);
    // return false;
  }
}
