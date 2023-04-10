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
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Purchase/GetPurchases`,
      {headers: this.headers}
    )
  }

  getVentaByNoPurchaseAndIdUser(noPurchase:string, idUser:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }

    return this._http.get<any>(`${this._dataServ.baseURL}/Purchase/GetPurchaseByNoPurchaseById?PurchaseNo=${noPurchase}&user=${idUser}`,
      {headers: this.headers}
    )
  }

  addVenta(formData:any, userId:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataVenta:Venta = {
      ...formData,
      "userId": userId,
      "reviewed": this._authServ.userData.Role != 'Cliente' ?true :false,
      "dateShiped": new Date()
    }
    console.log(dataVenta)
    return this._http.post(`${this._dataServ.baseURL}/Purchase/CreatePurchase`, dataVenta, {
      headers: this.headers
    })
  }

  updateVenta(formData:any, idVenta:number, state:boolean){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
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
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/ProductPurchase/GetProductByPurchase?purchaseId=${id}`,
      {headers: this.headers}
    )
  }

  addProducToVenta(idVenta:number, prods:any[]){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataProds = {
      "purchaseId": idVenta,
      "productPurchase": prods
    }

    console.log(dataProds)
    return this._http.post(`${this._dataServ.baseURL}/ProductPurchase/AddUpdateProduct`, dataProds, {
      headers: this.headers
    })
  }
}
