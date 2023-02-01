import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

import { DetalleCategoria } from 'src/app/pages/inventario.pages/detalle-categoria/detalle-categoria';
import { InventarioService } from 'src/app/services/inventario.service';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Categoria } from 'src/app/interfaces/models';

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

  isLoadingResults:boolean = true;

  constructor(
    private _dialog:MatDialog,
    public inveServ:InventarioService
  ){}

  ngOnInit(): void {
    this.getAllCategories()
  }

  getAllCategories(){
    const catsAll = this.inveServ.getCategories()
    catsAll.subscribe(res => {
      this.isLoadingResults = false
      this.inveServ.categorias = res.result
      console.log(this.inveServ.categorias)
    }, (err => {
      this.isLoadingResults = false
      console.log(err)
    }))
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
        this.getAllCategories()
      }
    })
  }

  chageState(row:Categoria){
    let msgDialog:string
    if(!row.isDeleted){
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
        row.isDeleted = !row.isDeleted
        const res = this.inveServ.updateCat(row.name, row.id, row.isDeleted)
          res.subscribe(res => {
            if(res){
              this.inveServ.notify('Categoría actualizada', 'success')
              this.isLoadingResults = true
              this.getAllCategories()
            }
          }, (err => {
            console.log(err)
            this.getAllCategories()
            this.inveServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  generateReport(){
    console.log('voy a generar el reporte xd')
  }
}
