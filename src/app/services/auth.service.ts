import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../interfaces/users.model';

@Injectable({ providedIn: 'root' })

export class AuthService {
  //public
  baseUrl:string = 'https://luveckservicesecurity.azurewebsites.net/api'
  public currentUser:User | undefined

  constructor(private _http: HttpClient, private _router:Router) {}


  public getCurrentUser() {
    let token: string |any = localStorage.getItem('currentUser')
    this.decodeToken(token)
  }

  register(userInfo:User){
    this._http.post<any>(`${this.baseUrl}/Security/Create`, userInfo)
      .subscribe(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user.token));
          this.decodeToken(user.token)
        }
      })
  }

  login(userInfo: { email: string, password: string }) {
    this._http.post<any>(`${this.baseUrl}/Security/Login`, userInfo)
      .subscribe(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user.token));
          this.decodeToken(user.token)
          this._router.navigate(['/home'])
        }
      }, ()=>{
        console.log('Usuario o contraseña invalidos.')
      })
  }

  /**
   * User logout
   *
   */
  logout() {
    localStorage.removeItem('currentUser');
    this._router.navigate(['authentication/login'])
  }



  decodeToken (token:string) {
    if(token){
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      let userInfo = JSON.parse(jsonPayload)
      console.log(userInfo)
    }
  }
}

/* const params = {
  userName: "Elvin",
  email: "elvinj@gmail.com",
  password: "G14t7227ls@dos",
  name: "Elvin",
  lastName: "Caceres",
  dni: "0306-1998-00959",
} */
