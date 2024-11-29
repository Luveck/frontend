import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ciudad, Departamento, Pais } from '../interfaces/models';
import { ApiService } from './api.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  userDevice: string = '';
  userIP: string = '';
  private countryList: Pais[] = [];
  private departmentList: Departamento[] = [];
  private cityList: Ciudad[] = [];

  constructor(
    private http: HttpClient,
    private readonly apiService: ApiService,
    private readonly dataServicio: DataService
  ) {}

  notify(msg: string, icon: any) {
    this.dataServicio.fir(msg, icon);
  }
  getUserDevice() {
    const userAgent = window.navigator.userAgent;
    const device = /Mobile/.test(userAgent) ? 'Mobile' : 'Desktop';
    this.userDevice = device;
  }

  getUserIP() {
    this.http.get('https://api.ipify.org/?format=json').subscribe(
      (res: any) => {
        this.userIP = res.ip;
      },
      (err) => {
        this.userIP = 'Error IP ' + err;
      }
    );
  }

  public addIpDevice<T>( model : T): T {
    return model = {
      ...model,
      Ip: this.userIP,
      Device: this.userDevice,
    }
  }

  public async setCountry() {
    this.countryList = await this.apiService.get<Pais[]>('Country');
  }

  public getCountryList() {
    return this.countryList;
  }

  public async setDepartments() {
    this.departmentList = await this.apiService.get<Departamento[]>(
      `Department`
    );
  }

  public getDepartmentList() {
    return this.departmentList;
  }

  public async setCities() {
    this.cityList = await this.apiService.get<Ciudad[]>(`City`);
  }

  public getCityList() {
    return this.cityList;
  }
}
