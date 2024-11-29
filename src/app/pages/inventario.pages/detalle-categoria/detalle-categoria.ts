import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/interfaces/models';
import { ApiService } from 'src/app/services/api.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-detalle-categoria',
  templateUrl: './detalle-categoria.html',
  styleUrls: ['./detalle-categoria.scss']
})

export class DetalleCategoria implements OnInit {
  currentCategoria!: Categoria | any;
  name!: string
  isLoadingResults!:boolean

  constructor(
    private readonly inveServ:InventarioService,
    public dialogo: MatDialogRef<DetalleCategoria>,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data.catId){
      this.searchCategory()
    }
  }

  public async searchCategory(){
    try {
      this.isLoadingResults = true
      this.currentCategoria = await this.apiService.get(`Category/${this.data.catId}`);
      this.name = this.currentCategoria.name;
    } catch (err) {
      this.sharedService.notify('Ocurrio un error', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }

  public async addCategory(Category: any) {
    try {
      this.apiService.post('Category', Category)
      this.sharedService.notify('Categoría registrada', 'success');
    } catch (error) {
      this.sharedService.notify('Ocurrio un error', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }

  public async updateCategory(Category: any) {
    try {
      this.apiService.put('Category', Category)
      this.sharedService.notify('Categoría actualizada', 'success');
    } catch (error) {
      this.sharedService.notify('Ocurrio un error', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }

  save(){
    let categoria: any = {
      name: this.name,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice
    }
    if(this.data.catId){
      categoria = {
       ...categoria,
        id: this.currentCategoria.id,
        isActive: this.currentCategoria.isActive,
      }
      this.updateCategory(categoria);
    }else{
      categoria = {
       ...categoria,
        isActive: true,
      }
      this.addCategory(categoria);
    }
    this.dialogo.close(true);
  }
}
