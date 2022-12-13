import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { Especialidad, Medico } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {
  especialidades:Especialidad[] |any
  headers:any

  constructor(
    private _http:HttpClient,
    private _authServ:AuthService,
    private _dataServ:DataService
  ) {
    this.headers = {'Authorization':`Bearer ${this._authServ.userToken}`}
  }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  /* ******endpoints de Especialidades****** */
  public getAllEspecialidades(){
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetPatologies`, {headers: this.headers})
  }

  public getEspecialidadById(id:string){
    return this._http.get<Especialidad>(`${this._dataServ.baseURL}/Administration/GetPatologyById?Id=${id}`, {headers: this.headers})
  }

  public addEspecialidad(name:string){
    let dataEspecial:Especialidad = {
      "name": name,
      "isDeleted": false,
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreatePatology`, dataEspecial, {headers: this.headers})
  }

  public deleteEspecialidad(id:number){
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeletePatology?Id=${id}`, {headers: this.headers})
  }

  public updateEspecial(name:string, state:boolean, especial:Especialidad | any){
    let especialToUpdate:Especialidad = {
      "id": especial?.id,
      "name": name,
      "isDeleted": state,
    }
    console.log(especialToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdatePatology`, especialToUpdate, {headers: this.headers})
  }

  public changeStateEspecialidad(state:boolean, especial:Especialidad | any){
    let especialToUpdate:Especialidad = {
      "id": especial?.id,
      "name": especial?.name,
      "isDeleted": state,
    }
    console.log(especialToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdatePatology`, especialToUpdate, {headers: this.headers})
  }

  /* ******endpoints de Medicos****** */
  public getAllMedicos(){
    return this._http.get<any>(`${this._dataServ.baseURL}/Medical/GetMedicals`,
      {headers: this.headers}
    )
  }

  public getMedicoByName(name:string){
    return this._http.get<Medico>(`${this._dataServ.baseURL}/Medical/GetMedicalByName?nameMedical=${name}`, {headers: this.headers})
  }

  public getMedicoById(id:string){
    return this._http.get<Medico>(`${this._dataServ.baseURL}/Medical/GetMedical?id=${id}`, {headers: this.headers})
  }

  public addMedico(formData:any, especialidad:Especialidad){
    let dataMedico:Medico = {
      ...formData,
      "patologyId": especialidad.id,
      "patologyName": especialidad.name,
    }
    console.log(dataMedico)
    return this._http.post(`${this._dataServ.baseURL}/Medical/CreateMedical`, dataMedico)
  }

  public deleteMedico(id:number){
    return this._http.delete(`${this._dataServ.baseURL}/Medical/DeleteMedical?Id=${id}`, {headers: this.headers})
  }

  public updateMedico(formData:any, currentStatus?:boolean, especialidad?:Especialidad, medicoId?:number){
    let dataMedico:Medico = {
      "id": medicoId,
      ...formData,
      "isDeleted": currentStatus,
      "patologyId": especialidad?.id,
      "patologyName": especialidad?.name
    }
    console.log(dataMedico)
    return this._http.put(`${this._dataServ.baseURL}/Medical/UpdateMedical`, dataMedico, {headers: this.headers})
  }


  changeStateMedico(state:boolean, medico:Medico | any){
    let medicoToUpdate:Medico = {
      "id": medico.id,
      "name": medico.name,
      "register": medico.register,
      "patologyId": medico.patologyId,
      "patologyName": medico.patologyName,
      "isDeleted": state
    }
    console.log(medicoToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Medical/UpdateMedical`, medicoToUpdate, {headers: this.headers})
  }
}
