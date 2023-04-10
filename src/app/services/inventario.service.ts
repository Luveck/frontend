import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Categoria, FilesToProduct, Producto } from '../interfaces/models';
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
    this.headers = {
      headers: new HttpHeaders(
        {
          'Authorization':`Bearer ${this._authServ.userToken}`,
          'Content-Type': 'application/json'
        }
      )
    }
  }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  /* ******endpoints de Categorias****** */
  getCategories(){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCategories`,
      this.headers
    )
  }

  getCategoriaById(id:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCategoryById?Id=${id}`,
      this.headers
    )
  }

  addCategoria(name:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataCat:Categoria = {
      "name": name,
      "isDeleted": false,
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCategory`, dataCat,
      this.headers
    )
  }

  deleteCat(id:number){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteCategory?Id=${id}`,
      this.headers
    )
  }

  updateCat(name:string, catId:number|undefined, state:boolean){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataCat:Categoria = {
      "id": catId,
      "name": name,
      "isDeleted": state
    }
    console.log(dataCat)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateCategory`, dataCat,
      this.headers
    )
  }

  /* ******endpoints de Productos****** */
  getProductos(){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetProducts`,
      this.headers
    )
  }

  getProductoById(id:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetProductById?Id=${id}`,
      this.headers
    )
  }

  addProducto(formData:any){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataProd:Producto = {
      ...formData,
      "state": true,
    }
    console.log(dataProd)
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateProduct`, dataProd,
      this.headers
    )
  }

  updateProd(formData:any, prodId:number, state:boolean){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    let dataProd:Producto = {
      "id": prodId,
      ...formData,
      state:state
    }
    console.log(dataProd)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateProduct`, dataProd,
      this.headers
    )
  }

  deleteProd(id:number){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteProduct?Id=${id}`, this.headers)
  }

  uploadImage(dataImg:FilesToProduct){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }
    console.log(dataImg)

    return this._http.post(`${this._dataServ.baseURL}/Administration/UploadImage`, dataImg,
      this.headers
    )
  }

  deleteImage(fileName:string){
    if(!this._authServ.checkTokenDate(this._authServ.expToken)){
      this._authServ.showSesionEndModal()
      return
    }

    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteImg?fileName=${fileName}`,
      this.headers
    )
  }
}
