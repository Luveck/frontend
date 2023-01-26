import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais, Departamento, Ciudad, Farmacia } from '../interfaces/models';
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
    let dataPais:Pais
    dataPais = {
      ...formData,
      "status": true
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCountry`, dataPais, {
      headers: this.headers
    })
  }

  updatePais(formData:any, idPais:number, status?:boolean){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataPais:Pais
    dataPais = {
      "id": idPais,
      ...formData,
      "status": status
    }
    console.log(dataPais)
    return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateCountry`, dataPais, {headers: this.headers})
  }

  /* Endpoints de Departamentos */
  getDepartamentos(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetDepartments`, {headers: this.headers})
  }

  getDepartamentoById(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetDepartmentById?Id=${id}`, {headers: this.headers})
  }

  addDepartamento(formData:any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataDepartamento:Departamento
    dataDepartamento = {
      ...formData,
      "status": true
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateDepartment`, dataDepartamento, {
      headers: this.headers
    })
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
    return this._http.get<Ciudad>(`${this._dataServ.baseURL}/Administration/GetCityById?Id=${id}`, {headers: this.headers})
  }

  addCiudad(formData:any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataCiudad:Ciudad
    dataCiudad = {
      ...formData,
      "status": true
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCity`, dataCiudad, {
      headers: this.headers
    })
  }

  updateCiudad(formData:any, idCity?:number){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataCiudad:Ciudad
    if(idCity){
      dataCiudad = {
        "id": idCity,
        "name": formData.name,
        "stateId": '1',
        "stateCode": 'FM',
        "stateName": formData.stateName,
      }
    }else{
      dataCiudad = {
        "name": formData.name,
        "stateId": '1',
        "stateCode": 'FM',
        "stateName": formData.stateName
      }
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateUpdateCity?user=${this._authServ.userData.name}`, dataCiudad)
  }

  /* Endpoints de farmacias */
  getFarmacias(){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<any>(`${this._dataServ.baseURL}/Pharmacy/GetPharmacies`,
      {headers: this.headers}
    )
  }

  public getFarmaciaByName(name:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<Farmacia>(`${this._dataServ.baseURL}/Pharmacy/GetPharmaciesByName?namePharmacy=${name}`)
  }

  public getFarmaciaById(id:string){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.get<Farmacia>(`${this._dataServ.baseURL}/Pharmacy/GetPharmacy?id=${id}`)
  }

  public addFarmacia(formData:any, ciudad:Ciudad){
    let dataFarmacia:Farmacia = {
      ...formData,
      "cityId": ciudad.id,
      "cityName": ciudad.name,
      "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "creationDate": new Date().toISOString(),
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(dataFarmacia)
    return this._http.post(`${this._dataServ.baseURL}/Pharmacy/CreatePharmacy`, dataFarmacia)
  }

  public deleteFarmacia(id:number){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    return this._http.delete(`${this._dataServ.baseURL}/Pharmacy/DeletePharmacy?Id=${id}&user=${this._authServ.userData.name}`)
  }

  public updateFarmacia(formData:any, currentStatus?:boolean, ciudad?:Ciudad, farnaId?:number){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let dataFarmacia:Farmacia = {
      "id": farnaId,
      ...formData,
      "isDeleted": currentStatus,
      "cityId": ciudad?.id,
      "cityName": ciudad?.name
    }
    console.log(dataFarmacia)
    return this._http.put(`${this._dataServ.baseURL}/Pharmacy/UpdatePharmacy`, dataFarmacia)
  }

  changeStateFarmacia(state:boolean, farmacia:Farmacia | any){
    (!this._authServ.checkTokenDate(this._authServ.expToken)) ? this._authServ.showSesionEndModal() :null
    let farmaToUpdate:Farmacia = {
      "id": farmacia.id,
      "name": farmacia.name,
      "adress": farmacia.adress,
      "cityId": farmacia.cityId,
      "cityName": farmacia.cityName,
      "isDeleted": state,
      "createBy": farmacia.createBy,
      "creationDate": farmacia.creationDate,
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(farmaToUpdate)
    return this._http.put(`${this._dataServ.baseURL}/Pharmacy/UpdatePharmacy`, farmaToUpdate)
  }
}
