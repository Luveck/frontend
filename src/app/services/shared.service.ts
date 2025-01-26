import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ciudad, Departamento, Pais } from '../interfaces/models';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private countryList: Pais[] = [];
  private departmentList: Departamento[] = [];
  private cityList: Ciudad[] = [];
  private countryCombo: any[] = [];
  defaultCountry: any = {
    id: 1,
    name: 'Honduras',
    iso3: 'HN',
  };

  constructor(
    private readonly apiService: ApiService,
    private readonly dataServicio: DataService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  notify(msg: string, icon: any) {
    this.dataServicio.fir(msg, icon);
  }

  public async setCountry() {
    try {
      this.countryList = await this.apiService.get<Pais[]>('Country');
    } catch (error) {
      this.notify(
        this.errorHandlerService.handleError(error, 'Listando paises:'),
        'error'
      );
    }
  }

  public getCountryList() {
    return this.countryList;
  }

  public async setDepartments() {
    try {
      this.departmentList = await this.apiService.get<Departamento[]>(
        `Department`
      );
    } catch (error) {
      this.notify(
        this.errorHandlerService.handleError(error, 'Listando departamenos:'),
        'error'
      );
    }
  }

  public getDepartmentList() {
    return this.departmentList;
  }

  public async setCities() {
    try {
      this.cityList = await this.apiService.get<Ciudad[]>(`City`);
    } catch (error) {
      this.notify(
        this.errorHandlerService.handleError(error, 'Listando ciudades:'),
        'error'
      );
    }
  }

  public getCityList() {
    return this.cityList;
  }

  public async setCountryCombo() {
    var result: any = await this.apiService.get('Country/combo');
    this.countryCombo = result.wasSuccessful
      ? result.result
      : this.defaultCountry;
  }

  public getCountryCombo() {
    return this.countryCombo;
  }
}
