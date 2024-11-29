import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

import { DetalleCategoria } from 'src/app/pages/inventario.pages/detalle-categoria/detalle-categoria';
import { InventarioService } from 'src/app/services/inventario.service';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Categoria } from 'src/app/interfaces/models';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})

export class CategoriasPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de categorías',
        isLink: false,
      }
    ]
  }
  public categories: any[] = [];
  isLoadingResults:boolean = true;
  filteredCategories: Categoria[] = [];

  constructor(
    private readonly _dialog:MatDialog,
    private readonly inveServ:InventarioService,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService
  ){}

  ngOnInit(): void {
    this.getCategories()
  }

  public async getCategories(){
    try {
      await this.inveServ.setCategories();
      this.filteredCategories = this.inveServ.getCategories();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con la petición', 'error')
    } finally {
      this.isLoadingResults = false;
      this.categories = this.inveServ.getCategories();
    }
  }

  on(id?:number){
    const config = {
      data: {
        title: id ?'Editar Categoría' :'Agregar Categoría',
        catId: id
      }
    }
    this._dialog.open(DetalleCategoria, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getCategories()
      }
    })
  }

  chageState(row:Categoria){
    let msgDialog:string
    if(row.isActive){
      msgDialog = '¿Seguro de querer inhabilitar esta categoría?'
    }else{
      msgDialog = '¿Seguro de querer habilitar esta categoría?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        const category = {
          id: row.id,
          name: row.name,
          isActive: !row.isActive,
          ip: this.sharedService.userIP,
          device: this.sharedService.userDevice
        }
        this.updateCategory(category);
        row.isActive = !row.isActive
      }
    })
  }

  public async updateCategory(category: any) {
    try {
      this.isLoadingResults = true;
      await this.apiService.put('Category', category)
      this.getCategories();
      this.sharedService.notify('Categoría actualizada', 'success');
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso.', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }

  generateReport(){
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Categorias de Productos',
        'body': this.inveServ.getCategories()
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();

    this.categories = this.filteredCategories.filter(cat =>
      cat.name.toLowerCase().includes(filterValue)
    );
  }
}
