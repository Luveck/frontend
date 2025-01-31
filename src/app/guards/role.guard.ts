import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authServ: AuthService, private router: Router) { }

  canActivate() {
    if(this.authServ.userToken){
      if(this.authServ.dataUser().Role == 'Admin' || this.authServ.dataUser().Role == 'Dependiente'){
        this.router.navigate(['admin/home']);
        return false
      }
      return true
    }
    return true
  }
}
