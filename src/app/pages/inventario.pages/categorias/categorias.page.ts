import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Categoria } from 'src/app/interfaces/models';
import { DetalleCategoriaPage } from 'src/app/pages/inventario.pages/detalle-categoria/detalle-categoria.page';
import { InventarioService } from 'src/app/services/inventario.service';

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
    private _dialogo:MatDialog,
    public inveServ:InventarioService
  ){}

  ngOnInit(): void {
    this.cargarAll()
  }

  cargarAll(){
    let catsAll = this.inveServ.getAllCategories()
    catsAll.subscribe(res => {
      this.isLoadingResults = false
      this.inveServ.categorias = res.result
      console.log(this.inveServ.categorias)
    }, (err => console.log(err)))
  }

  on(id?:string){
    const config = {
      data: {
        title: id ?'Editar Categoría' :'Agregar Categoría',
        cat: id
      }
    }
    this._dialogo.open(DetalleCategoriaPage, config)
    .afterClosed()
    .subscribe((confirmado:boolean) => {
      if(confirmado){
        this.isLoadingResults = true
        this.cargarAll()
      }
    })
  }

  delete(cat:Categoria){
    if(!cat.isDeleted){
      this._dialogo.open(DialogConfComponent, {
        data: `¿Seguro de querer inhabilitar esta categoría?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          const res = this.inveServ.deleteCat(cat.id!)
          res.subscribe(res => {
            if(res){
              this.inveServ.notify('Categoría eliminada', 'success')
              this.isLoadingResults = true
              this.cargarAll()
            }
          }, (err => {
            console.log(err)
            this.inveServ.notify('Ocurrio un error', 'error')
          }))
        }
      })
    }else{
      this._dialogo.open(DialogConfComponent, {
        data: `¿Seguro de querer habilitar esta categoría?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          const res = this.inveServ.changeStateCategoria(false, cat)
          res.subscribe(res => {
            if(res){
              this.inveServ.notify('Categoría restaurada', 'success')
              this.isLoadingResults = true
              this.cargarAll()
            }
          }, (err => {
            console.log(err)
            this.inveServ.notify('Ocurrio un error', 'error')
          }))
        }
      })
    }
  }
}
