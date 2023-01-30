import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Farmacia } from '../interfaces/models';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class FarmaciasService {
  listFarmacias!:Farmacia[]
  headers:any

  constructor(
    private _http:HttpClient,
    private _dataServ:DataService,
    private _authServ:AuthService
  ) {
    this.headers = {'Authorization':`Bearer ${this._authServ.userToken}`}
  }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  getFarmacias(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Pharmacy/GetPharmacies`,
      {headers: this.headers}
    )
  }

  getFarmaciaById(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Pharmacy/GetPharmacy?id=${id}`,
      {headers: this.headers}
    )
  }

  addFarmacia(formData:any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataFarmacia:Farmacia = {
      ...formData,
      "isDeleted": true
    }
    return this._http.post(`${this._dataServ.baseURL}/Pharmacy/CreatePharmacy`, dataFarmacia, {
      headers: this.headers
    })
  }

  updateFarmacia(formData:any, idFarmacia:number, state:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataFarmacia:Farmacia = {
      "id": idFarmacia,
      ...formData,
      "isDeleted": state,
    }
    console.log(dataFarmacia)
    return this._http.post(`${this._dataServ.baseURL}/Pharmacy/UpdatePharmacy`, dataFarmacia, {
      headers: this.headers
    })
  }
}
