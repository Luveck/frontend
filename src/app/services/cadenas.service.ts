import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cadena, Farmacia } from '../interfaces/models';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class CadenaService {
  listCadena!: Cadena[];
  headers: any;

  constructor(
    private readonly _http: HttpClient,
    private readonly _dataServ: DataService,
    private readonly _authServ: AuthService,
    private readonly sharedService: SharedService
  ) {}

  notify(msg: string, icon: any) {
    this._dataServ.fir(msg, icon);
  }

  getCadenas() {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get<any>(
      `${this._dataServ.baseURL}/Administration/GetAllChain`,
      { headers: this.headers }
    );
  }

  getCadenaById(id: string) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get<any>(
      `${this._dataServ.baseURL}/Administration/GetChainById?id=${id}`,
      { headers: this.headers }
    );
  }

  addCadena(formData: any) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    let data: Cadena = {
      ...formData,
      IsActive: true,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
    };
    return this._http.post(
      `${this._dataServ.baseURL}/Administration/CreateChain`,
      data,
      {
        headers: this.headers,
      }
    );
  }

  updateCadena(formData: any, id: number, state: boolean) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    let data: Cadena = {
      id: id,
      ...formData,
      IsActive: state,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
    };
    return this._http.post(
      `${this._dataServ.baseURL}/Administration/UpdateChain`,
      data,
      {
        headers: this.headers,
      }
    );
  }
}
