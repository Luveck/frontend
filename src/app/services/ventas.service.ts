import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Venta } from '../interfaces/models';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';
import { FilterPurchase } from '../entities/filter-purchases.entiy';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private purchases: any[] = [];
  private productsPurchases: any[] = [];
  headers: any;

  constructor(
    private _http: HttpClient,
    private _dataServ: DataService,
    private _authServ: AuthService,

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
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Creando ventas:'),
        'error'
      );
    } finally {
      this.sharedService.notify(
        'Se ha registrado exitosamente la factura en el sistema',
        'success'
      );
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
  // getVentas() {
  //   if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
  //     this._authServ.showSesionEndModal();
  //     return;
  //   }
  //   return this._http.get<any>(
  //     `${this._dataServ.baseURL}/Administration/GetPurchases`,
  //     { headers: this.headers }
  //   );
  // }

  // getPurchaseByIdPurchase(idPurchase: string) {
  //   if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
  //     this._authServ.showSesionEndModal();
  //     return;
  //   }

  //   return this._http.get<any>(
  //     `${this._dataServ.baseURL}/Administration/GetPurchaseById?idPurchase=${idPurchase}`,
  //     { headers: this.headers }
  //   );
  // }

  // addVenta(formData: any, userId: string, lstProducts: any) {
  //   if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
  //     this._authServ.showSesionEndModal();
  //     return;
  //   }
  //   let dataVenta: Venta = {
  //     ...formData,
  //     userId: userId,
  //     // "purchaseReviewed": this._authServ.userData.Role != 'Cliente' ? true :false,
  //     dateShiped: new Date(),
  //     lstProducts: lstProducts,
  //   };
  //   return this._http.post(
  //     `${this._dataServ.baseURL}/Administration/CreatePurchase`,
  //     dataVenta,
  //     {
  //       headers: this.headers,
  //     }
  //   );
  // }

  // updateVenta(formData: any) {
  //   if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
  //     this._authServ.showSesionEndModal();
  //     return;
  //   }
  //   let dataVenta: Venta = {
  //     ...formData,
  //   };
  //   console.log(dataVenta);
  //   return this._http.post(
  //     `${this._dataServ.baseURL}/Administration/UpdatePurchase`,
  //     dataVenta,
  //     {
  //       headers: this.headers,
  //     }
  //   );
  // }

  // checkVenta(formData: any, idVenta: number, state: boolean) {
  //   if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
  //     this._authServ.showSesionEndModal();
  //     return;
  //   }
  //   let dataVenta: Venta = {
  //     id: idVenta,
  //     ...formData,
  //     purchaseReviewed: state,
  //   };
  //   return this._http.post(
  //     `${this._dataServ.baseURL}/Administration/CheckPurchase`,
  //     dataVenta,
  //     {
  //       headers: this.headers,
  //     }
  //   );
  // }

  // getProductosOfVenta(id: string) {
  //   if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
  //     this._authServ.showSesionEndModal();
  //     return;
  //   }
  //   return this._http.get<any>(
  //     `${this._dataServ.baseURL}/Administration/GetPurchaseById?idPurchase=${id}`,
  //     { headers: this.headers }
  //   );
  // }
}
