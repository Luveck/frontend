import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  canActivate() {
    if (!this.sessionService.getToken()) {
      return true;
    }
    return false;
  }
}
