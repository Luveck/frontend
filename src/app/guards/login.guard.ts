import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authServ: AuthService) { }

  canActivate() {
    if(!this.authServ.userToken){
      return true
    }
    return false
  }
}
