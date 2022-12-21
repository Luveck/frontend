import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Categoria, Producto } from '../interfaces/models';
import { DataService } from './data.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  categorias:Categoria[] |any
  headers

  constructor(
    private _authServ:AuthService,
    private _dataServ:DataService,
    private _http:HttpClient
  ) {
    this.headers = {'Authorization':`Bearer ${this._authServ.userToken}`}
  }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  /* ******endpoints de Categorias****** */
  public getAllCategories(){
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCategories`,
      {headers: this.headers}
    )
  }

  public getCategoriaById(id:string){
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCategoryById?Id=${id}`,
      {headers: this.headers}
    )
  }

  public addCategoria(name:string){
    let dataCat:Categoria = {
      "name": name,
      "isDeleted": false,
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCategory`, dataCat,
      {headers: this.headers}
    )
  }

  public deleteCat(id:number){
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteCategory?Id=${id}`,
      {headers: this.headers}
    )
  }

  public updateCat(name:string, state:boolean, cat:Categoria | any){
    let catToUpdate:Categoria = {
      "id": cat?.id,
      "name": name,
      "isDeleted": state,
    }
    console.log(catToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdateCategory`, catToUpdate,
      {headers: this.headers}
    )
  }

  public changeStateCategoria(state:boolean, cat:Categoria | any){
    let catToUpdate:Categoria = {
      "id": cat?.id,
      "name": cat?.name,
      "isDeleted": state,
    }
    console.log(catToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdateCategory`, catToUpdate,
      {headers: this.headers}
    )
  }


  /* ******endpoints de Productos****** */
  public getAllProductos(){
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetProducts`,
      {headers: this.headers}
    )
  }

  public getProductoById(id:string){
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetProductById?Id=${id}`, {headers: this.headers})
  }

  public addProducto(formData:any, categoria:Categoria){
    let dataProd:Producto = {
      ...formData,
      "idCategory": categoria.id,
      "nameCategory": categoria.name
    }
    console.log(dataProd)
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateProduct`, dataProd, {headers: this.headers})
  }

  public updateProd(formData:any, categoria:Categoria, prodId:number){
    let dataProd:Producto = {
      "id": prodId,
      ...formData,
      "idCategory": categoria.id,
      "nameCategory": categoria.name,
    }
    console.log(dataProd)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdateProduct`, dataProd, {headers: this.headers})
  }

  public deleteProd(id:number){
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteProduct?Id=${id}`, {headers: this.headers})
  }
}
