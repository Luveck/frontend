import { Injectable } from '@angular/core';

import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { Categoria, Producto } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private listCategories : Categoria[] = []
  private listProducts: Producto[] = []

  constructor(

    private _authServ:AuthService,


    private readonly apiService: ApiService,
    private readonly dataService: DataService,

  ) {
    this._authServ.getCurrentUser();

  }

  public async setCategories(){
    this.listCategories = await this.apiService.get('Category');
  }

  public getCategories() {
    return this.listCategories;
  }

  public async setProducts(){
    this.listProducts = await this.apiService.get('Product');
  }

  public getProducts() {
    return this.listProducts;
  }
}
