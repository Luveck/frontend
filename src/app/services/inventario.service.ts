import { Injectable } from '@angular/core';

import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { Categoria, Producto } from '../interfaces/models';
import { ErrorHandlerService } from './error-handler.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private listCategories: Categoria[] = [];
  private listProducts: Producto[] = [];

  constructor(
    private _authServ: AuthService,

    private readonly apiService: ApiService,
    private readonly dataService: DataService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sharedService: SharedService
  ) {
    this._authServ.getCurrentUser();
  }

  public async setCategories() {
    try {
      this.listCategories = await this.apiService.get('Category');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando categorias:'),
        'error'
      );
    }
  }

  public getCategories() {
    return this.listCategories;
  }

  public async setProducts() {
    try {
      this.listProducts = await this.apiService.get('Product');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando productos:'),
        'error'
      );
    }
  }

  public getProducts() {
    return this.listProducts;
  }
}
