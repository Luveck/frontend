import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/interfaces/models';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-detalle-categoria',
  templateUrl: './detalle-categoria.html',
  styleUrls: ['./detalle-categoria.scss'],
})
export class DetalleCategoria implements OnInit {
  currentCategoria!: Categoria | any;
  name!: string;
  isLoadingResults!: boolean;

  constructor(
    private readonly inveServ: InventarioService,
    public dialogo: MatDialogRef<DetalleCategoria>,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    if (this.data.catId) {
      this.searchCategory();
    }
  }

  public async searchCategory() {
    try {
      this.isLoadingResults = true;
      this.currentCategoria = await this.apiService.get(
        `Category/${this.data.catId}`
      );
      this.name = this.currentCategoria.name;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Consultando categorias:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  public async addCategory(Category: any) {
    try {
      this.apiService.post('Category', Category);
      this.sharedService.notify('Categoría registrada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Crear categorias:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  public async updateCategory(Category: any) {
    try {
      this.apiService.put('Category', Category);
      this.sharedService.notify('Categoría actualizada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizar categorias:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  save() {
    let categoria: any = {
      name: this.name,
    };
    if (this.data.catId) {
      categoria = {
        ...categoria,
        id: this.currentCategoria.id,
        isActive: this.currentCategoria.isActive,
      };
      this.updateCategory(categoria);
    } else {
      categoria = {
        ...categoria,
        isActive: true,
      };
      this.addCategory(categoria);
    }
    this.dialogo.close(true);
  }
}
