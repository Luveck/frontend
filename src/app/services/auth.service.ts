import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userToken:any = null
  userData:any = null

  constructor(private _dataServ:DataService, private _http:HttpClient) {
    this.getCurrentUser()
  }

  getCurrentUser(){
    const currentUser = localStorage.getItem('LuveckUserData')
    if (currentUser){
      this.userData = JSON.parse(currentUser)
      this.userToken = this.userData.token
      this.decodeToken(this.userToken)
    }
  }

  public async login(formData:any){
    let info = {
      "dni": formData.dni,
      "password": formData.password
    }
    try {
      const result$ = this._http.post('https://luveckservicesecurity.azurewebsites.net/api/Security/Login', info)
      let data:any = await lastValueFrom(result$)
      console.log(data)
      this.userToken = data.token
      this.userData = {
        name: data.name,
        lastName: data.lastName,
        role: data.role.name,
        token: this.userToken
      }
      if(formData.remember){
        localStorage.setItem('LuveckUserData', JSON.stringify(this.userData));
      }
      this.decodeToken(this.userToken)
    } catch (error:any) {
      console.log(error)
      let msgError = error.error
      this._dataServ.fir(`${msgError}`, 'error')
    }
  }

  public async register(formData:any){
    console.log(formData)
    try {
      const result$ = this._http.post('https://luveckservicesecurity.azurewebsites.net/api/Security/Register', formData)
      let resData:any = await lastValueFrom(result$)
      console.log(resData)
      this.userToken = resData.token
      this.userData = {
        dni: formData.dni,
        email: formData.email,
        name: formData.name,
        lastName: formData.lastName,
        phone: formData.phone,
        role: resData.role.name,
        token: this.userToken
      }
      localStorage.setItem('LuveckUserData', JSON.stringify(this.userData))
      this.decodeToken(this.userToken)
    } catch (error:any) {
      console.log(error)
      let msgError = error.error
      this._dataServ.fir(`${msgError}`, 'error')
    }
  }

  private decodeToken (token:any) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    let tokenData = JSON.parse(jsonPayload)
    if(this.checkTokenDate(tokenData.exp)){
      //this._dataServ.goTo('/admin/home')
    }else{
      this.logOut()
      this._dataServ.fir('Credenciales vencidas', 'error')
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

  public logOut(){
    this.userToken = null
    this.userData = null
    localStorage.removeItem('LuveckUserData');
    this._dataServ.goTo('/authentication/login')
  }
}
