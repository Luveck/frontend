import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  localUsers:any[] = []
  localRoles:any[] = []
  headers: any

  constructor(
    private _http:HttpClient,
    private _authServ:AuthService,
    private _dataServ:DataService,
  ) {
    this.headers = {'Authorization':`Bearer ${this._authServ.userToken}`}
  }


  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  public getAllUsers(){
    return this._http.post(`https://apisecurityluveck.azurewebsites.net/api/Security/GetUsers`, {},
      {headers: this.headers}
    )
  }

  public getUserInfo(email:string){
    return this._http.get(`https://apisecurityluveck.azurewebsites.net/api/Security/getUser?Email=${email}`,
      {headers: this.headers}
    )
  }

  addUsuario(formData:any, idUser?:number){
    let dataUser:any
    dataUser = {
      "id": idUser,
      ...formData,
      "ctaStatus": true
    }
    //return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateCountry`, dataUser)
    this.localUsers.push(dataUser)
  }

  UpdateUsuario(formData:any, dni:string, status?:boolean){
    if(formData){
      let dataUser:any
      dataUser = {
        "dni": dni,
        ...formData,
        "ctaStatus": status
      }
      //return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateCountry`, dataUser)
      this.localUsers.forEach((user, index) => {
        if(user.dni === dni){
          this.localUsers[index] = dataUser
        }
      })
    }else{
      this.localUsers.forEach((user, index) => {
        if(user.dni === dni){
          this.localUsers[index].ctaStatus = !status
        }
      })
    }
  }

  /* Endpoints de Roles */

  public getAllRoles(){
    return this._http.get(`https://apisecurityluveck.azurewebsites.net/api/Roles/GetRoles`,
      {headers: this.headers}
    )
  }

  public createRole(nameRole:string){
    return this._http.post(`https://apisecurityluveck.azurewebsites.net/api/Roles/CreateRole?role=${nameRole}`, {},
      {headers: this.headers}
    )
  }
}
