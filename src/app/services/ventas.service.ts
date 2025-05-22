import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';
import { SessionService } from './session.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private purchases: any[] = [];
  private productsPurchases: any[] = [];

  constructor(
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sessionService: SessionService
  ) {}

  public async setProductsPurchases() {
    try {
      this.productsPurchases = await this.apiService.get('productsPurchases');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Listando productos por farmacia:'
        ),
        'error'
      );
    }
  }

  public async setProductsPurchasesFiltered(filter: any) {
    try {
      this.productsPurchases = await this.apiService.post(
        'Purchase/GetPurchaseFiltered',
        filter
      );
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Listando productos por farmacia:'
        ),
        'error'
      );
    }
  }

  public getProductsPurchases() {
    return this.productsPurchases;
  }

  public async setPurchase() {
    try {
      this.purchases = await this.apiService.get('Purchase');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando facturas:'),
        'error'
      );
    }
  }

  public async addPurchase(purchase: any) {
    try {
      await this.apiService.post('Purchase/CreatePruchase', purchase);
      this.sharedService.notify(
        'Se ha registrado exitosamente la factura en el sistema',
        'success'
      );
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Creando ventas:'),
        'error'
      );
    }
  }

  public async updatePurchase(purchase: any) {
    try {
      await this.apiService.put('Purchase/UpdatePurchase', purchase);
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando ventas:'),
        'error'
      );
    } finally {
      this.sharedService.notify('Venta actualizada correctamente.', 'success');
    }
  }

  public getPurchases() {
    return this.purchases;
  }

  public async getPurchaseById(puchaseId: string) {
    try {
      return await this.apiService.get(`Purchase/id/${puchaseId}`);
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Consultando la factura:'),
        'error'
      );
      return null;
    }
  }

  public async setPurchasesFiltered(filter: any) {
    try {
      this.purchases = await this.apiService.post(
        'Purchase/GetPurchaseByFiltered',
        filter
      );
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Listando productos por farmacia:'
        ),
        'error'
      );
    }
  }

  public async cancelPurchase(purchaseId: string) {
    try {
      const data = await this.apiService.put<ApiResponse<any>>(
        `Purchase/CancelPurchase?purchase=${purchaseId}`,
        purchaseId
      );

      this.sharedService.notify(
        data.message,
        data.message == 'Factura anulada' ? 'success' : 'error'
      );
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Cancelando venta:'),
        'error'
      );
    }
  }
}

export interface ApiResponse<T> {
  message: string;
  result: T;
  wasSuccessful: boolean;
}
