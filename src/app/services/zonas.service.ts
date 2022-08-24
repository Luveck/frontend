import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais, Departamento, Ciudad } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class ZonasService{
  baseURL:string = 'https://luveckapi.azurewebsites.net/api'
  listCountries:Pais[] | undefined |any
  listDepartments:Array<Departamento> | undefined |any
  listCities:Array<Ciudad> | undefined |any



  constructor(private _http:HttpClient) {}

  /* Endpoints de Paies */
  getPaises() {
    return this._http.get<Pais[]>(`${this.baseURL}/Administration/GetCountries`)
  }

  getPaisById(id:string){
    return this._http.get<Pais>(`${this.baseURL}/Administration/GetCountryById?Id=${id}`)
  }

  addOrUpdatePais(data:any){
    return this._http.post(`${this.baseURL}/Administration/CreateUpdateCountry`, data)
  }

  /* Endpoints de Departamentos */
  getDepartamentos(){
    return this._http.get<Departamento[]>(`${this.baseURL}/Department/GetDepartment`)
  }

  getDepartamentoById(id:string){
    return this._http.get<Departamento>(`${this.baseURL}/Department/GetDepartmentById?Id=${id}`)

  }

  /* Endpoints de Ciudades */
  getCiudades(){
    return this._http.get<Ciudad[]>(`${this.baseURL}/Administration/GetCities`)
  }

  getCiudadById(id:string){
    return this._http.get<Ciudad>(`${this.baseURL}/Administration/GetCityById?Id=${id}`)
  }

  addOrUpdateCiudad(data:any){
    return this._http.post(`${this.baseURL}/Administration/CreateUpdateCity`, data)
  }
}
