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

  constructor(
    private _http:HttpClient,
    private _authServ:AuthService,
    private _dataServ:DataService
  ) { }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  /* ******endpoints de Especialidades****** */
  public getAllEspecialidades(){
    return this._http.get<Especialidad[]>(`${this._dataServ.baseURL}/Administration/GetPatologies`)
  }

  public getEspecialidadById(id:string){
    return this._http.get<Especialidad>(`${this._dataServ.baseURL}/Administration/GetPatologyById?Id=${id}`)
  }

  public addEspecialidad(name:string){
    let dataEspecial:Especialidad = {
      "name": name,
      "isDeleted": false,
      "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "creationDate": new Date().toISOString(),
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreatePatology`, dataEspecial)
  }

  public deleteEspecialidad(id:number){
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeletePatology?Id=${id}&user=${this._authServ.userData.name}`)
  }

  public updateEspecial(name:string, state:boolean, especial:Especialidad | any){
    let especialToUpdate:Especialidad = {
      "id": especial?.id,
      "name": name,
      "isDeleted": state,
      "createBy": especial?.createBy,
      "creationDate": especial?.creationDate,
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(especialToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdatePatology`, especialToUpdate)
  }

  public changeStateEspecialidad(state:boolean, especial:Especialidad | any){
    let especialToUpdate:Especialidad = {
      "id": especial?.id,
      "name": especial?.name,
      "isDeleted": state,
      "createBy": especial?.createBy,
      "creationDate": especial?.creationDate,
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(especialToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdatePatology`, especialToUpdate)
  }

  /* ******endpoints de Medicos****** */
  public getAllMedicos(){
    return this._http.get<Medico[]>(`${this._dataServ.baseURL}/Medical/GetMedicals`)
  }

  public getMedicoByName(name:string){
    return this._http.get<Medico>(`${this._dataServ.baseURL}/Medical/GetMedicalByName?nameMedical=${name}`)
  }

  public getMedicoById(id:string){
    return this._http.get<Medico>(`${this._dataServ.baseURL}/Medical/GetMedical?id=${id}`)
  }

  public addMedico(formData:any, especialidad:Especialidad){
    let dataMedico:Medico = {
      ...formData,
      "patologyId": especialidad.id,
      "patologyName": especialidad.name,
      "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "creationDate": new Date().toISOString(),
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(dataMedico)
    return this._http.post(`${this._dataServ.baseURL}/Medical/CreateMedical`, dataMedico)
  }

  public deleteMedico(id:number){
    return this._http.delete(`${this._dataServ.baseURL}/Medical/DeleteMedical?Id=${id}&user=${this._authServ.userData.name}`)
  }

  public updateMedico(formData:any, currentStatus?:boolean, especialidad?:Especialidad, medicoId?:number){
    let dataMedico:Medico = {
      "id": medicoId,
      ...formData,
      "isDeleted": currentStatus,
      "patologyId": especialidad?.id,
      "patologyName": especialidad?.name,
      "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "creationDate": new Date().toISOString(),
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(dataMedico)
    return this._http.put(`${this._dataServ.baseURL}/Medical/UpdateMedical`, dataMedico)
  }


  changeStateMedico(state:boolean, medico:Medico | any){
    let medicoToUpdate:Medico = {
      "id": medico.id,
      "name": medico.name,
      "register": medico.register,
      "patologyId": medico.patologyId,
      "patologyName": medico.patologyName,
      "isDeleted": state,
      "createBy": medico.createBy,
      "creationDate": medico.creationDate,
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(medicoToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Medical/UpdateMedical`, medicoToUpdate)
  }
}
