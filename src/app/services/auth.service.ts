import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataService } from './data.service';
import { SesionEndComponent } from '../components/sesion-end/sesion-end.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userToken:any = null
  userData:any = null
  expToken:number|any = null

  constructor(
    private _dataServ:DataService,
    private _http:HttpClient,
    private _dialog: MatDialog,
  ) {
    this.getCurrentUser()
  }

  getCurrentUser(){
    const tokentUser = localStorage.getItem('LuveckUserToken')
    if (tokentUser){
      this.userToken = tokentUser
      this.decodeToken(this.userToken)
    }
  }

  public async login(formData:any){
    let info = {
      "dni": formData.dni,
      "password": formData.password
    }
    return this._http.post('https://apisecurityluveck.azurewebsites.net/api/Security/Login', info).toPromise()
  }

  public async register(formData:any){
    console.log(formData)
    return this._http.post('https://apisecurityluveck.azurewebsites.net/api/Security/Register', formData).toPromise()
  }

  public decodeToken (token:any) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    let tokenData = JSON.parse(jsonPayload)
    this.userData = {
      UserId: tokenData.UserId,
      UserName: tokenData.UserName,
      LastName: tokenData.LastName,
      Role: tokenData.Role,
      Email: tokenData.Email
    }
    this.expToken = tokenData.exp
    if(this.checkTokenDate(tokenData.exp)){
      if(tokenData.Role != 'Cliente'){
        this._dataServ.goTo('/admin/home')
      }else{
        this._dataServ.goTo('/inicio')
      }
    }else{
      this.showSesionEndModal()
    }
  }

  checkTokenDate(exp:number):boolean{
    let dateToken = new Date(exp * 1000)
    let dateNow = new Date()
    if(dateNow >= dateToken){
      return false
    }else{
      return true
    }
  }

  public logOut(role:string){
    this.userToken = null
    this.userData = null
    localStorage.removeItem('LuveckUserToken');
    role === 'Admin'
      ? this._dataServ.goTo('/authentication/login')
      : this._dataServ.goTo('/inicio')
  }

  showSesionEndModal(){
    const config:MatDialogConfig = {
      disableClose: true
    }
    this._dialog.open(SesionEndComponent, config)
    .afterClosed()
    .subscribe(()=>{
      this._dialog.closeAll()
      this.logOut(this.userData.Role)
    })
  }
}
