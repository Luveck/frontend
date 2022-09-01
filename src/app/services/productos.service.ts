import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Producto } from '../interfaces/models';
import { DataService } from './data.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  productos:Producto[] |any = [
    {
      "id": 1,
      "name": "Panadol",
      "description": "pastillas bla bla",
      "presentation": "Caja",
      "quantity": 8,
      "typeSell": "Caja",
      "cost": 20,
      "createBy": "Elvin Caceres",
      "creationDate": "2022-09-01T02:55:29.626Z",
      "updateBy": "Elvin Caceres",
      "updateDate": "2022-09-01T02:55:29.626Z",
      "idCategory": 0,
      "nameCategory": "Pastillas"
    },
    {
      "id": 1,
      "name": "Panadol",
      "description": "pastillas bla bla",
      "presentation": "Caja",
      "quantity": 8,
      "typeSell": "Caja",
      "cost": 20,
      "createBy": "Elvin Caceres",
      "creationDate": "2022-09-01T02:55:29.626Z",
      "updateBy": "Elvin Caceres",
      "updateDate": "2022-09-01T02:55:29.626Z",
      "idCategory": 0,
      "nameCategory": "Pastillas"
    },
    {
      "id": 1,
      "name": "Panadol",
      "description": "pastillas bla bla",
      "presentation": "Caja",
      "quantity": 8,
      "typeSell": "Caja",
      "cost": 20,
      "createBy": "Elvin Caceres",
      "creationDate": "2022-09-01T02:55:29.626Z",
      "updateBy": "Elvin Caceres",
      "updateDate": "2022-09-01T02:55:29.626Z",
      "idCategory": 0,
      "nameCategory": "Pastillas"
    },
    {
      "id": 1,
      "name": "Panadol",
      "description": "pastillas bla bla",
      "presentation": "Caja",
      "quantity": 8,
      "typeSell": "Caja",
      "cost": 20,
      "createBy": "Elvin Caceres",
      "creationDate": "2022-09-01T02:55:29.626Z",
      "updateBy": "Elvin Caceres",
      "updateDate": "2022-09-01T02:55:29.626Z",
      "idCategory": 0,
      "nameCategory": "Pastillas"
    },
    {
      "id": 1,
      "name": "Panadol",
      "description": "pastillas bla bla",
      "presentation": "Caja",
      "quantity": 8,
      "typeSell": "Caja",
      "cost": 20,
      "createBy": "Elvin Caceres",
      "creationDate": "2022-09-01T02:55:29.626Z",
      "updateBy": "Elvin Caceres",
      "updateDate": "2022-09-01T02:55:29.626Z",
      "idCategory": 0,
      "nameCategory": "Pastillas"
    },
    {
      "id": 1,
      "name": "Panadol",
      "description": "pastillas bla bla",
      "presentation": "Caja",
      "quantity": 8,
      "typeSell": "Caja",
      "cost": 20,
      "createBy": "Elvin Caceres",
      "creationDate": "2022-09-01T02:55:29.626Z",
      "updateBy": "Elvin Caceres",
      "updateDate": "2022-09-01T02:55:29.626Z",
      "idCategory": 0,
      "nameCategory": "Pastillas"
    },
  ]

  constructor(private autnServ:AuthService, private _dataServ:DataService, private _http:HttpClient) { }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  public getAllProductos(){
    return this._http.get<Producto[]>(`${this._dataServ.baseURL}/Administration/GetProducts`)
  }

  public getCategoriaById(id:string){
    return this._http.get<Producto>(`${this._dataServ.baseURL}/Administration/GetProductsById?Id=${id}`)
  }

/*   public addCategoria(name:string, state:boolean){
    let dataCat:Producto = {
      "name": name,
      "state": state,
      "createBy": `${this.autnServ.userData.name} ${this.autnServ.userData.lastName}`,
      "creationDate": new Date().toISOString(),
      "updateBy": `${this.autnServ.userData.name} ${this.autnServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(dataCat)
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCategory`, dataCat)
  } */

  public deleteProd(id:number){
    return this._http.delete(`${this._dataServ.baseURL}/Administration/DeleteCategory?Id=${id}`)
  }

/*   public updateCat(name:string, state:boolean, cat:Producto | any){
    let catToUpdate:Producto = {
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
  } */
}
