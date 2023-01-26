import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

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
    }, (err => {
      this.isLoadingResults = false
      console.log(err)
    }))
  }

  on(id?:string){
    const config = {
      data: {
        title: id ?'Editar Categoría' :'Agregar Categoría',
        catId: id
      }
    }
    this._dialogo.open(DetalleCategoriaPage, config)
    .afterClosed()
    .subscribe(() => {
      this.isLoadingResults = true
      this.cargarAll()
    })
  }
}
