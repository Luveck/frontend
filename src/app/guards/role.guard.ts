import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly sessionService: SessionService
  ) {}

  canActivate() {
    if (this.sessionService.getToken()) {
      if (
        this.sessionService.getUserData().Role == 'Admin' ||
        this.sessionService.getUserData().Role == 'Dependiente'
      ) {
        this.router.navigate(['admin/home']);
        return false;
      }
      return true;
    }
    return true;
  }
}
