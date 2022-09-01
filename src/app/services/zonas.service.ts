import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais, Departamento, Ciudad } from '../interfaces/models';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ZonasService{
  listCountries:Pais[] | undefined |any
  listDepartments:Array<Departamento> | undefined |any
  listCities:Array<Ciudad> | undefined |any

  constructor(private _dataServ:DataService, private _http:HttpClient) {}

  /* Endpoints de Paies */
  getPaises() {
    return this._http.get<Pais[]>(`${this._dataServ.baseURL}/Administration/GetCountries`)
  }

  getPaisById(id:string){
    return this._http.get<Pais>(`${this._dataServ.baseURL}/Administration/GetCountryById?Id=${id}`)
  }

  addOrUpdatePais(data:any){
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateUpdateCountry`, data)
  }

  /* Endpoints de Departamentos */
  getDepartamentos(){
    return this._http.get<Departamento[]>(`${this._dataServ.baseURL}/Department/GetDepartment`)
  }

  getDepartamentoById(id:string){
    return this._http.get<Departamento>(`${this._dataServ.baseURL}/Department/GetDepartmentById?Id=${id}`)

  }

  /* Endpoints de Ciudades */
  getCiudades(){
    return this._http.get<Ciudad[]>(`${this._dataServ.baseURL}/Administration/GetCities`)
  }

  getCiudadById(id:string){
    return this._http.get<Ciudad>(`${this._dataServ.baseURL}/Administration/GetCityById?Id=${id}`)
  }

  addOrUpdateCiudad(data:any){
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateUpdateCity`, data)
  }
}
