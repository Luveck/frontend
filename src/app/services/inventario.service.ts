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

  constructor(
    private _authServ:AuthService,
    private _dataServ:DataService,
    private _http:HttpClient
  ) { }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  /* ******endpoints de Categorias****** */
  public getAllCategories(){
    return this._http.get<Categoria[]>(`${this._dataServ.baseURL}/Administration/GetCategories`)
  }

  public getCategoriaById(id:string){
    return this._http.get<Categoria>(`${this._dataServ.baseURL}/Administration/GetCategoryById?Id=${id}`)
  }

  public addCategoria(name:string){
    let dataCat:Categoria = {
      "name": name,
      "isDeleted": false,
      "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "creationDate": new Date().toISOString(),
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCategory?user=${this._authServ.userData.name}`, dataCat)
  }

  public deleteCat(id:number){
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteCategory?Id=${id}`)
  }

  public updateCat(name:string, state:boolean, cat:Categoria | any){
    let catToUpdate:Categoria = {
      "id": cat?.id,
      "name": name,
      "isDeleted": state,
      "createBy": cat?.createBy,
      "creationDate": cat?.creationDate,
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(catToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdateCategory?user=${this._authServ.userData.name}`, catToUpdate)
  }

  public changeStateCategoria(state:boolean, cat:Categoria | any){
    let catToUpdate:Categoria = {
      "id": cat?.id,
      "name": cat?.name,
      "isDeleted": state,
      "createBy": cat?.createBy,
      "creationDate": cat?.creationDate,
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(catToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdateCategory?user=${this._authServ.userData.name}`, catToUpdate)
  }


  /* ******endpoints de Productos****** */
  public getAllProductos(){
    return this._http.get<Producto[]>(`${this._dataServ.baseURL}/Administration/GetProducts`)
  }

  public getProductoById(id:string){
    return this._http.get<Producto>(`${this._dataServ.baseURL}/Administration/GetProductsById?Id=${id}`)
  }

  public addProducto(formData:any, categoria:Categoria){
    let dataProd:Producto = {
      ...formData,
      "idCategory": categoria.id,
      "nameCategory": categoria.name,
      "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "creationDate": new Date().toISOString(),
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(dataProd)
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateProduct?user=${this._authServ.userData.name}`, dataProd)
  }

  public updateProd(formData:any, categoria:Categoria, prodId:number){
    let dataProd:Producto = {
      "id": prodId,
      ...formData,
      "idCategory": categoria.id,
      "nameCategory": categoria.name,
      "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "creationDate": new Date().toISOString(),
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(dataProd)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdateProduct?user=${this._authServ.userData.name}`, dataProd)
  }

  public deleteProd(id:number){
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteProduct?Id=${id}`)
  }
}
