import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { Especialidad, Medico } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {
  especialidades!:Especialidad[]
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
  public getEspecialidades(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetPatologies`,
      {headers: this.headers}
    )
  }

  public getEspecialidadById(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetPatologyById?Id=${id}`,
      {headers: this.headers}
    )
  }

  public addEspecialidad(name:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataEspecial:Especialidad = {
      "name": name,
      "isDeleted": false,
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreatePatology`, dataEspecial,
      {headers: this.headers}
    )
  }

  public deleteEspecialidad(id:number){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeletePatology?Id=${id}`,
      {headers: this.headers}
    )
  }

  public updateEspecial(name:string, especialId:number|undefined, state:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataEspecial:Especialidad = {
      "id": especialId,
      "name": name,
      "isDeleted": state,
    }
    console.log(dataEspecial)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdatePatology`, dataEspecial,
      {headers: this.headers}
    )
  }

  /* ******endpoints de Medicos****** */
  public getMedicos(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Medical/GetMedicals`,
      {headers: this.headers}
    )
  }

  public getMedicoByName(name:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<Medico>(`${this._dataServ.baseURL}/Medical/GetMedicalByName?nameMedical=${name}`,
      {headers: this.headers}
    )
  }

  public getMedicoById(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Medical/GetMedical?id=${id}`,
      {headers: this.headers}
    )
  }

  public addMedico(formData:any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataMedico:Medico = {
      ...formData,
      "isDeleted": false
    }
    console.log(dataMedico)
    return this._http.post(`${this._dataServ.baseURL}/Medical/CreateMedical`, dataMedico,
      {headers: this.headers}
    )
  }

  public deleteMedico(id:number){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.delete(`${this._dataServ.baseURL}/Medical/DeleteMedical?Id=${id}`,
      {headers: this.headers}
    )
  }

  public updateMedico(formData:any, medicoId:number, state:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataMedico:Medico = {
      "id": medicoId,
      ...formData,
      "isDeleted": state
    }
    console.log(dataMedico)
    return this._http.post(`${this._dataServ.baseURL}/Medical/UpdateMedical`, dataMedico,
      {headers: this.headers}
    )
  }
}
