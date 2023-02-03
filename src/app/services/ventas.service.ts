import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Venta } from '../interfaces/models';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
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

  getVentas(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Purchase/GetPurchases`,
      {headers: this.headers}
    )
  }

  getVentaByNoPurchase(noPurchase:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Purchase/GetPurchaseByNoPurchase?PurchaseNo=${noPurchase}`,
      {headers: this.headers}
    )
  }

  addVenta(formData:any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataVenta:Venta = {
      ...formData,
      "userId": this._authServ.userData.UserId,
      "reviewed": false
    }
    return this._http.post(`${this._dataServ.baseURL}/Purchase/CreatePurchase`, dataVenta, {
      headers: this.headers
    })
  }

  updateVenta(formData:any, idVenta:number, state:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataVenta:Venta = {
      "id": idVenta,
      ...formData,
      "reviewed": state,
      "dateShiped": new Date()
    }
    console.log(dataVenta)
    return this._http.post(`${this._dataServ.baseURL}/Purchase/UpdatePurchase`, dataVenta, {
      headers: this.headers
    })
  }

  getProductosOfVenta(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/ProductPurchase/GetProductByPurchase?purchaseId=${id}`,
      {headers: this.headers}
    )
  }
}
