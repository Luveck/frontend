import { Injectable } from '@angular/core';
import { Cadena, Farmacia } from '../interfaces/models';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class FarmaciasService {
  private chainList: any[] = [];
  private pharmacyList: any[] = [];

  constructor(
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sharedService: SharedService
  ) {}

  public async setPharmacies() {
    try {
      this.pharmacyList = await this.apiService.get('Pharmacy');
      return this.pharmacyList;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando farmacias:'),
        'error'
      );
      return [];
    }
  }

  public async setPharmaciesBycountry(countryId: string) {
    try {
      this.pharmacyList = await this.apiService.get(
        'Pharmacy/GetByCountry' + countryId
      );
      return this.pharmacyList;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando farmacias:'),
        'error'
      );
      return [];
    }
  }

  public getPharmacies() {
    return this.pharmacyList;
  }

  public async setChain() {
    try {
      this.chainList = await this.apiService.get('Chain');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando cadenas:'),
        'error'
      );
    }
  }

  public async setChainByCountry(countryId: string) {
    try {
      return await this.apiService.get(
        'Chain/GetChainByCountry?countryId=' + countryId
      );
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando cadenas:'),
        'error'
      );

      return [];
    }
  }

  public getChainList() {
    return this.chainList;
  }
}
