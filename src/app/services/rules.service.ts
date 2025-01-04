import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  private rules: any[] = [];
  private productsRuleByCountry: any[] = [];

  constructor(
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService
  ) {}

  public async setRules() {
    this.rules = await this.apiService.get('ProductChangeRule')
  }

  public getRules() {
    return this.rules;
  }

  public async setProductsRuleByCountry(countryId: string) {
    this.productsRuleByCountry = await this.apiService.get(`ProductChangeRule/GetProductsLandingByCountry/${ countryId }`);
  }

  public getProductsRuleByCountry() {
    return this.productsRuleByCountry;
  }
}
