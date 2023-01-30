import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Categoria, Producto } from '../interfaces/models';
import { DataService } from './data.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  categorias!:Categoria[]
  listProducts!:Producto[]
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

  /* ******endpoints de Categorias****** */
  getCategories(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCategories`,
      {headers: this.headers}
    )
  }

  getCategoriaById(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCategoryById?Id=${id}`,
      {headers: this.headers}
    )
  }

  addCategoria(name:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataCat:Categoria = {
      "name": name,
      "isDeleted": false,
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCategory`, dataCat,
      {headers: this.headers}
    )
  }

  deleteCat(id:number){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteCategory?Id=${id}`,
      {headers: this.headers}
    )
  }

  updateCat(name:string, catId:number|undefined, state:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataCat:Categoria = {
      "id": catId,
      "name": name,
      "isDeleted": state
    }
    console.log(dataCat)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateCategory`, dataCat,
      {headers: this.headers}
    )
  }

  /* ******endpoints de Productos****** */
  getProductos(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetProducts`,
      {headers: this.headers}
    )
  }

  getProductoById(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetProductById?Id=${id}`,
      {headers: this.headers}
    )
  }

  addProducto(formData:any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataProd:Producto = {
      ...formData,
      state: true
    }
    console.log(dataProd)
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateProduct`, dataProd,
      {headers: this.headers}
    )
  }

  updateProd(formData:any, prodId:number, state:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataProd:Producto = {
      "id": prodId,
      ...formData,
      state:state
    }
    console.log(dataProd)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateProduct`, dataProd,
      {headers: this.headers}
    )
  }

  deleteProd(id:number){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteProduct?Id=${id}`, {headers: this.headers})
  }
}
