import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { Especialidad, Medico } from '../interfaces/models';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {
  especialidades!:Especialidad[]
  headers:any

  constructor(
    private _http:HttpClient,
    private _authServ:AuthService,
    private _dataServ:DataService,
    private sharedService: SharedService
  ) {
    this.headers = {'Authorization':`Bearer ${this._authServ.userToken}`}
  }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  /* ******endpoints de Especialidades****** */
  public getEspecialidades(){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetPatologies`,
      {headers: this.headers}
    )
  }

  public getEspecialidadById(id:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetPatologyById?Id=${id}`,
      {headers: this.headers}
    )
  }

  public addEspecialidad(name:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataEspecial:Especialidad = {
      "name": name,
      "isActive": true,
      "ip": this.sharedService.userIP,
      "device": this.sharedService.userDevice
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreatePatology`, dataEspecial,
      {headers: this.headers}
    )
  }

  public deleteEspecialidad(id:number){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeletePatology?Id=${id}`,
      {headers: this.headers}
    )
  }

  public updateEspecial(name:string, especialId:number|undefined, state:boolean){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataEspecial:Especialidad = {
      "id": especialId,
      "name": name,
      "isActive": state,
      "ip": this.sharedService.userIP,
      "device": this.sharedService.userDevice
    }
    console.log(dataEspecial)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdatePatology`, dataEspecial,
      {headers: this.headers}
    )
  }

  /* ******endpoints de Medicos****** */
  public getMedicos(){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Medical/GetMedicals`,
      {headers: this.headers}
    )
  }

  public getMedicoByName(name:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<Medico>(`${this._dataServ.baseURL}/Medical/GetMedicalByName?nameMedical=${name}`,
      {headers: this.headers}
    )
  }

  public getMedicoById(id:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Medical/GetMedicalById?id=${id}`,
      {headers: this.headers}
    )
  }

  public addMedico(formData:any){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataMedico:Medico = {
      ...formData,
      "isActive": true,
      "ip": this.sharedService.userIP,
      "device": this.sharedService.userDevice
    }
    console.log(dataMedico)
    return this._http.post(`${this._dataServ.baseURL}/Medical/CreateMedical`, dataMedico,
      {headers: this.headers}
    )
  }

  public deleteMedico(id:number){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.delete(`${this._dataServ.baseURL}/Medical/DeleteMedical?Id=${id}`,
      {headers: this.headers}
    )
  }

  public updateMedico(formData:any, medicoId:number, state:boolean){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataMedico:Medico = {
      "id": medicoId,
      ...formData,
      "isActive": state,
      "ip": this.sharedService.userIP,
      "device": this.sharedService.userDevice
    }
    console.log(dataMedico)
    return this._http.post(`${this._dataServ.baseURL}/Medical/UpdateMedical`, dataMedico,
      {headers: this.headers}
    )
  }
}
