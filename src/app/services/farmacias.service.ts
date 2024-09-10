import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Farmacia } from '../interfaces/models';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class FarmaciasService {
  listFarmacias!:Farmacia[]
  headers:any

  constructor(
    private _http:HttpClient,
    private _dataServ:DataService,
    private _authServ:AuthService,
    private sharedService: SharedService
  ) {
    this.headers = {'Authorization':`Bearer ${this._authServ.userToken}`}
  }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  getFarmacias(){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Pharmacy/GetPharmacies`,
      {headers: this.headers}
    )
  }

  getFarmaciaById(id:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Pharmacy/GetPharmacy?id=${id}`,
      {headers: this.headers}
    )
  }

  addFarmacia(formData:any){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataFarmacia:Farmacia = {
      ...formData,
      "IsActive": true,
      "ip": this.sharedService.userIP,
      "device": this.sharedService.userDevice
    }
    return this._http.post(`${this._dataServ.baseURL}/Pharmacy/CreatePharmacy`, dataFarmacia, {
      headers: this.headers
    })
  }

  updateFarmacia(formData:any, idFarmacia:number, state:boolean){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataFarmacia:Farmacia = {
      "id": idFarmacia,
      ...formData,
      "IsActive": state,
      "ip": this.sharedService.userIP,
      "device": this.sharedService.userDevice
    }
    console.log(dataFarmacia)
    return this._http.post(`${this._dataServ.baseURL}/Pharmacy/UpdatePharmacy`, dataFarmacia, {
      headers: this.headers
    })
  }
}
