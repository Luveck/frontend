// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Pais, Departamento, Ciudad } from '../interfaces/models';
// import { AuthService } from './auth.service';
// import { DataService } from './data.service';
// import { SharedService } from './shared.service';
// import { SessionService } from './session.service';
// import { ApiService } from './api.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class ZonasService{
//   listPaises!:Pais[]
//   listDepartamentos!:Departamento[]
//   listCiudades!:Ciudad[]
//   headers:any

//   constructor(
//     private _http:HttpClient,
//     // private _authServ:AuthService,
//     private _dataServ:DataService,
//     private readonly sharedService: SharedService,
//     private readonly sessionService: SessionService,
//     private readonly apiService: ApiService,
//     private readonly errorHandlerService: ErrorHandlerService
//   ) {
//     // this._authServ.getCurrentUser();
//     this.headers = { Authorization: `Bearer ${this.sessionService.getToken()}` };
//   }

//   notify(msg:string, icon:any){
//     this._dataServ.fir(msg, icon)
//   }

//   /* Endpoints de Paies */
//   getPaises() {
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCountries`,
//       {headers: this.headers}
//     )
//   }

//   getPaisById(id:string){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCountryById?Id=${id}`,
//       {headers: this.headers}
//     )
//   }

//   addPais(formData:any){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     let dataPais:Pais = {
//       ...formData,
//       "status": true,
//       "ip": this.sharedService.userIP,
//       "device": this.sharedService.userDevice
//     }
//     return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCountry`, dataPais, {
//       headers: this.headers
//     })
//   }

//   updatePais(formData:any, idPais:number, status:boolean){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     let dataPais:Pais = {
//       "id": idPais,
//       ...formData,
//       "status": status,
//       "ip": this.sharedService.userIP,
//       "device": this.sharedService.userDevice
//     }
//     console.log(dataPais)
//     return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateCountry`, dataPais,
//       {headers: this.headers}
//     )
//   }

//   /* Endpoints de Departamentos */
//   getDepartamentos(){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetDepartments`,
//       {headers: this.headers}
//     )
//   }

//   getDepartamentoById(id:string){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetDepartmentById?Id=${id}`,
//       {headers: this.headers}
//     )
//   }

//   addDepartamento(formData:any){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     let dataDepartamento:Departamento = {
//       ...formData,
//       "status": true,
//       "ip": this.sharedService.userIP,
//       "device": this.sharedService.userDevice
//     }
//     return this._http.post(`${this._dataServ.baseURL}/Administration/CreateDepartment`, dataDepartamento, {
//       headers: this.headers
//     })
//   }

//   updateDepartamento(formData:any, idDepartamento:number, status:boolean){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     let dataDepartamento:Departamento = {
//       "id": idDepartamento,
//       ...formData,
//       "status": status,
//       "ip": this.sharedService.userIP,
//       "device": this.sharedService.userDevice
//     }
//     return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateDepartment`, dataDepartamento,
//       {headers: this.headers}
//     )
//   }

//   /* Endpoints de Ciudades */
//   getCiudades(){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCities`,
//       {headers: this.headers}
//     )
//   }

//   getCiudadById(id:string){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     return this._http.get<any>(`${this._dataServ.baseURL}/Administration/GetCityById?Id=${id}`,
//       {headers: this.headers}
//     )
//   }

//   addCiudad(formData:any){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     let dataCiudad:Ciudad = {
//       ...formData,
//       "state": true,
//       "ip": this.sharedService.userIP,
//       "device": this.sharedService.userDevice
//     }
//     return this._http.post(`${this._dataServ.baseURL}/Administration/CreateCity`, dataCiudad, {
//       headers: this.headers
//     })
//   }

//   updateCiudad(formData:any, idCity:number, state:boolean){
//     if(!this._authServ.checkTokenDate(this._authServ.expToken)){
//       this._authServ.showSesionEndModal()
//       return
//     }
//     let dataCiudad:Ciudad = {
//       "id": idCity,
//       ...formData,
//       "state": state,
//       "ip": this.sharedService.userIP,
//       "device": this.sharedService.userDevice
//     }
//     return this._http.post(`${this._dataServ.baseURL}/Administration/UpdateCity`, dataCiudad, {
//       headers: this.headers
//     })
//   }

//   getAll(){
//     this.getCiudades();
//     this.getDepartamentos();
//     this.getPaises();
//   }
// }
