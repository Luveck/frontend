import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  localRoles:any[] = []
  usersGlobal:any[] = []
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

  public getUsers(){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get(`${this._dataServ.baseURLSec}/Security/GetUsers`,
      {headers: this.headers}
    )
  }

  public getUserByID(id:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get(`${this._dataServ.baseURLSec}/Security/getUserByID?Id=${id}`,
      {headers: this.headers}
    )
  }

  public getUserByDNI(dni:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get(`${this._dataServ.baseURLSec}/Security/getUserByDNI?DNI=${dni}`,
      {headers: this.headers}
    )
  }

  addUsuario(formData:any){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    console.log(formData)
    let dataUser:any
    dataUser = {
      ...formData,
      "state": true
    }
    return this._http.post(`${this._dataServ.baseURLSec}/Security/CreateUser`, dataUser,
      {headers: this.headers}
    )
  }

  UpdateUsuario(formData:any, state:boolean){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    console.log(formData)
    let dataUser:any
    dataUser = {
      ...formData,
      "state": state
    }
    console.log(dataUser)
    return this._http.post(`${this._dataServ.baseURLSec}/Security/UpdateUser`, dataUser,
      {headers: this.headers}
    )
  }

  changePassword(formData:any){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    console.log(formData)
    return this._http.post(`${this._dataServ.baseURLSec}/Security/ChangePassword`, formData,
      {headers: this.headers}
    )
  }

  /* Endpoints de Roles */

  public getAllRoles(){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get(`${this._dataServ.baseURLSec}/Roles/GetRoles`,
      {headers: this.headers}
    )
  }

  public createRole(nameRole:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.post(`${this._dataServ.baseURLSec}/Roles/CreateRole?role=${nameRole}`, {},
      {headers: this.headers}
    )
  }
}
