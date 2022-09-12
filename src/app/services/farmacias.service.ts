import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class FarmaciasService {

  constructor(
    private _http:HttpClient,
    private _dataServ:DataService
  ) { }

  getAllPharmacies(){
    return this._http.get<any[]>(`${this._dataServ.baseURL}/Pharmacy/GetPharmacies`)
  }
}
