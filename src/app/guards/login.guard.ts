import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authServ: AuthService, private router: Router) { }

  canActivate() {
    if(this.authServ.userToken){
      return true
    }
    this.router.navigate(['/login']);
    return false
  }
}
