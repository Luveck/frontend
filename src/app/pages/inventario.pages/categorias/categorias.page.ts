import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

import { CategoryInfoComponent } from 'src/app/components/category-info/category-info.component';
import { CategoriasService } from 'src/app/services/categorias.service';

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
        link: '/'
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
    public catServ:CategoriasService
  ){}

  ngOnInit(): void {
    this.cargarAll()
  }

  cargarAll(){
    let catsAll = this.catServ.getAllCategories()
    catsAll.subscribe(res => {
      this.isLoadingResults = false
      this.catServ.categorias = res
      console.log(this.catServ.categorias)
    }, (err => console.log(err)))
  }

  on(id?:string){
    const config = {
      data: {
        title: id ?'Editar Categoría' :'Agregar Categoría',
        cat: id
      }
    }
    this._dialogo.open(CategoryInfoComponent, config)
    .afterClosed()
    .subscribe((confirmado:boolean) => {
      if(confirmado){
        this.isLoadingResults = true
        this.cargarAll()
      }
    })
  }
}
