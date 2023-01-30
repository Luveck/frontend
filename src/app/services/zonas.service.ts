import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais, Departamento, Ciudad } from '../interfaces/models';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ZonasService{
  listPaises!:Pais[]
  listDepartamentos!:Departamento[]
  listCiudades!:Ciudad[]
  headers:any

  constructor(
    private _http:HttpClient,
    private _authServ:AuthService,
    private _dataServ:DataService,
  ) {
    this.headers = {'Authorization':`Bearer ${this._authServ.userToken}`}
  }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }

  /* Endpoints de Paies */
  getPaises() {
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCountries`,
      {headers: this.headers}
    )
  }

  getPaisById(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCountryById?Id=${id}`,
      {headers: this.headers}
    )
  }

  addPais(formData:any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataPais:Pais = {
      ...formData,
      "status": true
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCountry`, dataPais, {
      headers: this.headers
    })
  }

  updatePais(formData:any, idPais:number, status:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataPais:Pais = {
      "id": idPais,
      ...formData,
      "status": status
    }
    console.log(dataPais)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateCountry`, dataPais,
      {headers: this.headers}
    )
  }

  /* Endpoints de Departamentos */
  getDepartamentos(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetDepartments`,
      {headers: this.headers}
    )
  }

  getDepartamentoById(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetDepartmentById?Id=${id}`,
      {headers: this.headers}
    )
  }

  addDepartamento(formData:any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataDepartamento:Departamento = {
      ...formData,
      "status": true
    }
    console.log(dataDepartamento)
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateDepartment`, dataDepartamento, {
      headers: this.headers
    })
  }

  updateDepartamento(formData:any, idDepartamento:number, status:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataDepartamento:Departamento = {
      "id": idDepartamento,
      ...formData,
      "status": status
    }
    console.log(dataDepartamento)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateDepartment`, dataDepartamento,
      {headers: this.headers}
    )
  }

  /* Endpoints de Ciudades */
  getCiudades(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCities`,
      {headers: this.headers}
    )
  }

  getCiudadById(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCityById?Id=${id}`,
      {headers: this.headers}
    )
  }

  addCiudad(formData:any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataCiudad:Ciudad = {
      ...formData,
      "state": true
    }
    console.log(dataCiudad)
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCity`, dataCiudad, {
      headers: this.headers
    })
  }

  updateCiudad(formData:any, idCity:number, state:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataCiudad:Ciudad = {
      "id": idCity,
      ...formData,
      "state": state,
    }
    console.log(dataCiudad)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateCity`, dataCiudad, {
      headers: this.headers
    })
  }
}
