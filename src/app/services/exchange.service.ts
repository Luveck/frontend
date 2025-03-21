import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  private Exchanges: any[] = [];

  constructor(
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sessionService: SessionService
  ) {}

  public async setExchangesFiltered(filter: any) {
    try {
      this.Exchanges = await this.apiService.post(
        'Exchange/GetExchangeByFilter',
        filter
      );
      return this.Exchanges;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando canjes:'),
        'error'
      );
      return [];
    }
  }

  public getExchanges() {
    return this.Exchanges;
  }

  public async GetProductExchangeByUser(userId: string) {
    try {
      return await this.apiService.get(
        'Exchange/GetProductExchangeByUser?userId=' + userId
      );
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Consultando canjes por usuario:'
        ),
        'error'
      );
      return null;
    }
  }

  public async addExchange(data: any) {
    try {
      const response = await this.apiService.post('Exchange/AddExchange', data);
      this.sharedService.notify('Se creo el canje exitosamente', 'success');
      return response;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Creando canjes por usuario:'
        ),
        'error'
      );
      return null;
    }
  }

  public async GiveExchangeAsync(data: any) {
    try {
      const result = await this.apiService.put(
        'Exchange/GiveExchangeAsync?exchangeId=' + data,
        data
      );
      this.sharedService.notify(
        'Se actualizo la información exitosamente',
        'success'
      );
      return result;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Reversando canjes por usuario:'
        ),
        'error'
      );
      return null;
    }
  }

  public async ReversExchangeAsync(data: any) {
    try {
      const result = await this.apiService.put(
        'Exchange/ReversExchangeAsync?exchangeId=' + data,
        data
      );
      this.sharedService.notify(
        'Se actualizo la información exitosamente',
        'success'
      );
      return result;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Reversando canjes por usuario:'
        ),
        'error'
      );
      return null;
    }
  }
}
