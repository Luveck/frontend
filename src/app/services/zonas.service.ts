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
  listCiudades!:Ciudad[]
  apiToken!:string
  headers:any

  constructor(
    private _http:HttpClient,
    private _authServ:AuthService,
    private _dataServ:DataService,
  ) {
    this.headers = {'Authorization':`Bearer ${this._authServ.userToken}`}
  }

  /* api de paises */
  getApiToken(){
    this._http.get(
      'https://www.universal-tutorial.com/api/getaccesstoken',
      {headers: {
        'api-token':'oWeQFMFe1cZlEwHEWdeq-zZmaBRQrl8V3DbWX4s1P0-4egYR4pQckPDMMBl3RPIk_ME',
        'user-email': 'ecaceres@yourappland.com'
      }}).subscribe((res:any) => this.apiToken = res.auth_token)
  }

  getDepartamentosByPais(pais:string){
    return this._http.get(
      `https://www.universal-tutorial.com/api/states/${pais}`,
      {headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Accept': 'application/json'
      }})
  }

  notify(msg:string, icon:any){
    this._dataServ.fir(msg, icon)
  }
  /* Endpoints de Paies */
  getPaises() {
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCountries`,
      {headers: this.headers}
    )
  }

  getPaisById(id:string){
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCountryById?Id=${id}`,
      {headers: this.headers}
    )
  }

  addPais(formData:any){
    let dataPais:Pais
    dataPais = {
      ...formData,
      "status": true
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCountry`, dataPais, {
      headers: this.headers
    })
  }
  addOrUpdatePais(formData:any, idPais?:number, status?:boolean){
    let dataPais:Pais
    if(idPais){
      dataPais = {
        "id": idPais,
        ...formData,
        "status": status,
        "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
        "creationDate": new Date().toISOString(),
        "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
        "updateDate": new Date().toISOString()
      }
    }else{
      dataPais = {
        ...formData,
        "status": true,
        "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
        "creationDate": new Date().toISOString(),
        "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
        "updateDate": new Date().toISOString()
      }
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateUpdateCountry?user=${this._authServ.userData.name}`, dataPais)
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
    return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCities`,
      {headers: this.headers}
    )
  }

  getCiudadById(id:string){
    return this._http.get<Ciudad>(`${this._dataServ.baseURL}/Administration/GetCityById?Id=${id}`)
  }

  addOrUpdateCiudad(formData:any, idCity?:number){
    let dataCiudad:Ciudad
    if(idCity){
      dataCiudad = {
        "id": idCity,
        "name": formData.name,
        "stateId": '1',
        "stateCode": 'FM',
        "stateName": formData.stateName,
        "countryId": this.listPaises[formData.countryName].id.toString(),
        "countryName": this.listPaises[formData.countryName].currencyName,
        "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
        "creationDate": new Date().toISOString(),
        "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
        "updateDate": new Date().toISOString()
      }
    }else{
      dataCiudad = {
        "name": formData.name,
        "stateId": '1',
        "stateCode": 'FM',
        "stateName": formData.stateName,
        "countryId": this.listPaises[formData.countryName].id.toString(),
        "countryName": this.listPaises[formData.countryName].name,
        "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
        "creationDate": new Date().toISOString(),
        "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
        "updateDate": new Date().toISOString()
      }
    }
    return this._http.post(`${this._dataServ.baseURL}/Administration/CreateUpdateCity?user=${this._authServ.userData.name}`, dataCiudad)
  }

  /* Endpoints de farmacias */
  getFarmacias(){
    return this._http.get<any>(`${this._dataServ.baseURL}/Pharmacy/GetPharmacies`,
      {headers: this.headers}
    )
  }

  public getFarmaciaByName(name:string){
    return this._http.get<Farmacia>(`${this._dataServ.baseURL}/Pharmacy/GetPharmaciesByName?namePharmacy=${name}`)
  }

  public getFarmaciaById(id:string){
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
    return this._http.delete(`${this._dataServ.baseURL}/Pharmacy/DeletePharmacy?Id=${id}&user=${this._authServ.userData.name}`)
  }

  public updateFarmacia(formData:any, currentStatus?:boolean, ciudad?:Ciudad, farnaId?:number){
    let dataFarmacia:Farmacia = {
      "id": farnaId,
      ...formData,
      "isDeleted": currentStatus,
      "cityId": ciudad?.id,
      "cityName": ciudad?.name,
      "createBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "creationDate": new Date().toISOString(),
      "updateBy": `${this._authServ.userData.name} ${this._authServ.userData.lastName}`,
      "updateDate": new Date().toISOString()
    }
    console.log(dataFarmacia)
    return this._http.put(`${this._dataServ.baseURL}/Pharmacy/UpdatePharmacy`, dataFarmacia)
  }

  changeStateFarmacia(state:boolean, farmacia:Farmacia | any){
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
