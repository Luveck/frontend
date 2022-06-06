import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { User, Role } from 'app/auth/models';
import { Router } from '@angular/router';
import { DataService } from 'app/main/services/data.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  baseUrl:string = 'https://luveckservicesecurity.azurewebsites.net/api'
  public currentUser: Observable<User>;


  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   * @param {Router} _router
   */
  constructor(private _http: HttpClient, private _dataServ: DataService, private _router:Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  register(userInfo:User){
    this._http
      .post<any>(`${this.baseUrl}/Security/Create`, userInfo)
      .subscribe(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user.token));
          this.decodeToken(user.token)
        }
      })
  }

  login(userInfo: { email: string, password: string }) {
    this._http
      .post<any>(`${this.baseUrl}/Security/Login`, userInfo)
      .subscribe(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user.token));
          this.decodeToken(user.token)
          this._router.navigate(['/sample/home'])
        }
      }, ()=>{
        this._dataServ.fir('Usuario o contraseña invalidos.', 'error')
      })
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }



  decodeToken (token:string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    let userInfo = JSON.parse(jsonPayload)
    this.currentUserSubject.next(userInfo);
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
