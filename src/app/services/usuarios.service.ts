import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  localUsers = [
    {
      'name': 'Elvin',
      'lastName': 'Cáceres',
      'role': 'Administrador',
      'dni': '0306199800959',
      'email': 'elvin@gmail.com',
      'phone': '+50494701343',
      'ctaStatus': true
    },
    {
      'name': 'Pedro',
      'lastName': 'Rojas',
      'role': 'Dependiente',
      'dni': '0306199800950',
      'email': 'pedro@gmail.com',
      'phone': '+50494701343',
      'ctaStatus': true
    },
    {
      'name': 'Linda',
      'lastName': 'Cáceres',
      'role': 'Cliente',
      'dni': '0306199800951',
      'email': 'linda@gmail.com',
      'phone': '+50494701343',
      'ctaStatus': true
    },
    {
      'name': 'Bessy',
      'lastName': 'Andino',
      'role': 'Cliente',
      'dni': '0306199800952',
      'email': 'bessy@gmail.com',
      'phone': '+50494701343',
      'ctaStatus': true
    },
    {
      'name': 'Paco',
      'lastName': 'Martinez',
      'role': 'Dependiente',
      'dni': '0306199800953',
      'email': 'paco@gmail.com',
      'phone': '+50494701343',
      'ctaStatus': false
    },
    {
      'name': 'Astrid',
      'lastName': 'Martinez',
      'role': 'Cliente',
      'dni': '0306199800953',
      'email': 'aaa@gmail.com',
      'phone': '+50494701343',
      'ctaStatus': true
    },
    {
      'name': 'Kayla',
      'lastName': 'Peraza',
      'role': 'Cliente',
      'dni': '0306199800953',
      'email': 'ka@gmail.com',
      'phone': '+50494701343',
      'ctaStatus': true
    },
  ]

  localRoles = [
    {
      'id': 1,
      'name': 'Administrador'
    },
    {
      'id': 2,
      'name': 'Dependiente'
    },
    {
      'id': 3,
      'name': 'Cliente'
    }
  ]
  constructor(
    private _dataServ:DataService,
  ) { }


  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  getAllUsers(){
    return this.localUsers
  }

  getUserById(dni:string){
    let userEnCuestion = this.localUsers.filter(user => user.dni === dni)
    return userEnCuestion[0]
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
}
