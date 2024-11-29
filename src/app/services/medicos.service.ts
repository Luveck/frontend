import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Especialidad, Medico, Patology } from '../interfaces/models';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MedicosService {
  private patologyList: Patology[] = [];
  private specialtyList : Especialidad[] = [];
  private medicList: Medico[] = [];

  constructor(
    private readonly _authServ: AuthService,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService
  ) {
    this.sharedService.getUserDevice();
    this.sharedService.getUserIP();
    this._authServ.getCurrentUser();
  }

  public async setSpecialties() {
    this.specialtyList = await this.apiService.get('Discipline');
  }
  public getSpecialties() {
    return this.specialtyList;
  }
  public async setPatology() {
    this.patologyList = await this.apiService.get('Patology');
  }
  public getPatology() {
    return this.patologyList;
  }

  public async setMedicos() {
    this.medicList = await this.apiService.get('Medical');
  }

  public getMedicos() {
    return this.medicList;
  }
}
