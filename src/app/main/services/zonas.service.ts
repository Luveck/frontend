import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pais, Departamento, Ciudad } from '../pages/paises/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ZonasService{
  baseURL:string = 'https://luveckapi.azurewebsites.net/api/Administration'
  listCountries:Array<Pais>
  listDepartments:Array<Departamento>
  listCities:Array<Ciudad>



  constructor(private _http:HttpClient) {}

  getPaises(): Promise<any[]> {
    return new Promise((resolve, reject) => {

      this._http.get(`${this.baseURL}/GetCountries`).subscribe((response: any) => {
        this.listCountries = response
        resolve(this.listCountries);
      }, reject);
    });
  }

  getPaisById(id:number):Promise<any[]>{
    return new Promise((resolve, reject) => {
      this._http.get(`${this.baseURL}/GetCountryById?Id=${id}`).subscribe((res:any) =>{
        this.listCountries = res
        resolve(this.listCountries)
      }, reject)
    })
  }

  getDepartamentos():Promise<any[]>{
    return new Promise((resolve, reject) => {
      this._http.get(`${this.baseURL}/GetDepartment`).subscribe((res:any) =>{
        this.listCountries = res
        resolve(this.listCountries)
      }, reject)
    })
  }

  getDepartamentoById(id:number):Promise<any[]>{
    return new Promise((resolve, reject) => {
      this._http.get(`${this.baseURL}/GetDepartmentById?Id=${id}`).subscribe((res:any) =>{
        this.listCountries = res
        resolve(this.listCountries)
      }, reject)
    })
  }

  getCiudades():Promise<any[]>{
    return new Promise((resolve, reject) => {
      this._http.get(`${this.baseURL}/GetCities`).subscribe((res:any) =>{
        this.listCountries = res
        resolve(this.listCountries)
      }, reject)
    })
  }

  getCiudadesById(id:number):Promise<any[]>{
    return new Promise((resolve, reject) => {
      this._http.get(`${this.baseURL}/GetCityById?Id=${id}`).subscribe((res:any) =>{
        this.listCountries = res
        resolve(this.listCountries)
      }, reject)
    })
  }
}
