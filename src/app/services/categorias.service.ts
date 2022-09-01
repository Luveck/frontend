import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Categoria } from '../interfaces/models';
import { DataService } from './data.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  categorias:Categoria[] |any

  constructor(private autnServ:AuthService, private _dataServ:DataService, private _http:HttpClient) { }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  public getAllCategories(){
    return this._http.get<Categoria[]>(`${this._dataServ.baseURL}/Administration/GetCategories`)
  }

  public getCategoriaById(id:string){
    return this._http.get<Categoria>(`${this._dataServ.baseURL}/Administration/GetCategoryById?Id=${id}`)
  }

  public addCategoria(name:string, state:boolean){
    let dataCat:Categoria = {
      "name": name,
      "state": state,
      "createBy": `${this.autnServ.userData.name} ${this.autnServ.userData.lastName}`,
      "creationDate": new Date().toISOString(),
      "updateBy": `${this.autnServ.userData.name} ${this.autnServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(dataCat)
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCategory`, dataCat)
  }

  public deleteCat(id:number){
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteCategory?Id=${id}`)
  }

  public updateCat(name:string, state:boolean, cat:Categoria | any){
    let catToUpdate:Categoria = {
      "id": cat?.id,
      "name": name,
      "state": state,
      "createBy": cat?.createBy,
      "creationDate": cat?.creationDate,
      "updateBy": `${this.autnServ.userData.name} ${this.autnServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(catToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Administration/UpdateCategory`, catToUpdate)
  }
}
