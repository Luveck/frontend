import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Venta } from '../interfaces/models';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private purchases: any[] = [];
  private productsPurchases: any[] = [];
  headers:any

  constructor(
    private _http:HttpClient,
    private _dataServ:DataService,
    private _authServ:AuthService,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService
  ) {
    this.sharedService.getUserDevice();
    this.sharedService.getUserIP();
    this._authServ.getCurrentUser();
    this.headers = {'Authorization':`Bearer ${this._authServ.userToken}`}
  }

  public async setProductsPurchases(){
    this.productsPurchases = await this.apiService.get('productsPurchases')
  }

  public getProductsPurchases(){
    return this.productsPurchases;
  }

  public async setPurchase(){
    this.purchases = await this.apiService.get('Purchase')
  }

  public getPurchases(){
    return this.purchases;
  }

  getVentas(){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetPurchases`,
      {headers: this.headers}
    )
  }

  getPurchaseByIdPurchase(idPurchase:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }

    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetPurchaseById?idPurchase=${idPurchase}`,
      {headers: this.headers}
    )
  }

  addVenta(formData:any, userId:string, lstProducts: any){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataVenta:Venta = {
      ...formData,
      "userId": userId,
      // "purchaseReviewed": this._authServ.userData.Role != 'Cliente' ? true :false,
      "dateShiped": new Date(),
      "IP": this.sharedService.userIP,
      "device": this.sharedService.userDevice,
      "lstProducts": lstProducts
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreatePurchase`, dataVenta, {
      headers: this.headers
    })
  }

  updateVenta(formData:any){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataVenta:Venta = {
      ...formData,
      "IP": this.sharedService.userIP,
      "device": this.sharedService.userDevice,
    }
    console.log(dataVenta)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdatePurchase`, dataVenta, {
      headers: this.headers
    })
  }

  checkVenta(formData:any, idVenta:number, state:boolean){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataVenta:Venta = {
      "id": idVenta,
      ...formData,
      "purchaseReviewed": state,
      "IP": this.sharedService.userIP,
      "device": this.sharedService.userDevice,
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CheckPurchase`, dataVenta, {
      headers: this.headers
    })
  }

  getProductosOfVenta(id:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetPurchaseById?idPurchase=${id}`,
      {headers: this.headers}
    )
  }
}
