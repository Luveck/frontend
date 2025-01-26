import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Especialidad, Medico, Patology } from '../interfaces/models';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class MedicosService {
  private patologyList: Patology[] = [];
  private specialtyList: Especialidad[] = [];
  private medicList: Medico[] = [];

  constructor(
    private readonly _authServ: AuthService,
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sharedService: SharedService
  ) {}

  public async setSpecialties() {
    try {
      this.specialtyList = await this.apiService.get('Discipline');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando especialidades:'),
        'error'
      );
    }
  }
  public getSpecialties() {
    return this.specialtyList;
  }
  public async setPatology() {
    try {
      this.patologyList = await this.apiService.get('Patology');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando Patologias:'),
        'error'
      );
    }
  }
  public getPatology() {
    return this.patologyList;
  }

  public async setMedicos() {
    try {
      this.medicList = await this.apiService.get('Medical');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando medicos:'),
        'error'
      );
    }
  }

  public getMedicos() {
    return this.medicList;
  }
}
