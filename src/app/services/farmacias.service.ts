import { Injectable } from '@angular/core';
import { Cadena, Farmacia } from '../interfaces/models';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class FarmaciasService {
  private chainList: Cadena[] = [];
  private pharmacyList: Farmacia[] = [];
  listFarmacias!: Farmacia[];
  headers: any;

  constructor(
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sharedService: SharedService
  ) {}

  public async setPharmacies() {
    try {
      this.pharmacyList = await this.apiService.get('Pharmacy');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando farmacias:'),
        'error'
      );
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

  public getChainList() {
    return this.chainList;
  }
}
