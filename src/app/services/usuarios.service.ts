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

  public getUsers(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.post(`https://apisecurityluveck.azurewebsites.net/api/Security/GetUsers`, {},
      {headers: this.headers}
    )
  }

  public getUserByID(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get(`https://apisecurityluveck.azurewebsites.net/api/Security/getUserByID?Id=${id}`,
      {headers: this.headers}
    )
  }

  public getUserByDNI(dni:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get(`https://apisecurityluveck.azurewebsites.net/api/Security/getUserByDNI?DNI=${dni}`,
      {headers: this.headers}
    )
  }

  addUsuario(formData:any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    console.log(formData)
    let dataUser:any
   /*  dataUser = {
      "id": idUser,
      ...formData,
      "ctaStatus": true
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateCountry`, dataUser) */
  }

  UpdateUsuario(formData:any, dni:string, status?:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
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
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get(`https://apisecurityluveck.azurewebsites.net/api/Roles/GetRoles`,
      {headers: this.headers}
    )
  }

  public createRole(nameRole:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.post(`https://apisecurityluveck.azurewebsites.net/api/Roles/CreateRole?role=${nameRole}`, {},
      {headers: this.headers}
    )
  }
}
