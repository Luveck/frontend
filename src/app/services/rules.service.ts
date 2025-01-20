import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  private rules: any[] = [];
  private productsRuleByCountry: any[] = [];

  constructor(
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  public async setRules() {
    try {
      this.rules = await this.apiService.get('ProductChangeRule');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Listando reglas de canje:'
        ),
        'error'
      );
    }
  }

  public getRules() {
    return this.rules;
  }

  public async setProductsRuleByCountry(countryId: string) {
    try {
      this.productsRuleByCountry = await this.apiService.get(
        `ProductChangeRule/GetProductsLandingByCountry/${countryId}`
      );
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando productos:'),
        'error'
      );
    }
  }

  public getProductsRuleByCountry() {
    return this.productsRuleByCountry;
  }
}
