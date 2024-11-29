import { Injectable } from '@angular/core';
import { Cadena, Farmacia } from '../interfaces/models';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';

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
    private readonly sharedService: SharedService
  ) {}

  public async setPharmacies() {
    this.pharmacyList = await this.apiService.get('Pharmacy');
  }

  public getPharmacies() {
    return this.pharmacyList;
  }

  public async setChain() {
    this.chainList = await this.apiService.get('Chain');
  }

  public getChainList() {
    return this.chainList;
  }
}
