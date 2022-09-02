import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/interfaces/models';
import { CategoriasService } from 'src/app/services/categorias.service';
import { DialogConfComponent } from '../dialog-conf/dialog-conf.component';

@Component({
  selector: 'app-category-info',
  templateUrl: './category-info.component.html',
  styleUrls: ['./category-info.component.scss']
})
export class CategoryInfoComponent implements OnInit {
  currentCategoria!: Categoria | undefined;
  name!: string
  state: boolean = true

  constructor(
    private _catServ:CategoriasService,
    private _dialog: MatDialog,
    public dialogo: MatDialogRef<CategoryInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data.cat){
      const cat = this._catServ.getCategoriaById(this.data.cat)
      cat.subscribe(res => {
        console.log(res)
        this.currentCategoria = res
        this.name = this.currentCategoria.name
        this.state = this.currentCategoria.isDeleted
      })
    }
  }

  save(){
    if(this.data.cat){
      let res = this._catServ.updateCat(this.name, this.state, this.currentCategoria)
      res.subscribe(res => {
        if(res){
          this._catServ.notify('Categoría actualizada', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this._catServ.notify('Ocurrio un error', 'error')
      }))
    }else{
      let res = this._catServ.addCategoria(this.name, this.state)
      res.subscribe(res => {
        if(res){
          this._catServ.notify('Categoría agregada', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this._catServ.notify('Ocurrio un error', 'error')
      }))
    }
  }

  delete(id:number){
    this._dialog.open(DialogConfComponent, {
      data: `¿Seguro de querer Cerrar la sesión?`
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        const res = this._catServ.deleteCat(id)
        res.subscribe(res => {
          if(res){
            this._catServ.notify('Categoría eliminada', 'success')
            this.dialogo.close(true)
          }
        }, (err => {
          console.log(err)
          this._catServ.notify('Ocurrio un error', 'error')
        }))
      }
    })
  }
}
