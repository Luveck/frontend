import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/interfaces/models';
import { InventarioService } from 'src/app/services/inventario.service';


@Component({
  selector: 'app-detalle-categoria',
  templateUrl: './detalle-categoria.page.html',
  styleUrls: ['./detalle-categoria.page.scss']
})
export class DetalleCategoriaPage implements OnInit {
  currentCategoria!: Categoria;
  name: string = ''
  state: boolean = true
  isLoadingResults?:boolean

  constructor(
    private _inveServ:InventarioService,
    public dialogo: MatDialogRef<DetalleCategoriaPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data.cat){
      this.isLoadingResults = true
      const cat = this._inveServ.getCategoriaById(this.data.cat)
      cat.subscribe(res => {
        console.log(res)
        this.currentCategoria = res.result
        this.isLoadingResults = false
        this.name = this.currentCategoria.name
        this.state = this.currentCategoria.isDeleted
      })
    }
  }

  save(){
    if(this.data.cat){
      let res = this._inveServ.updateCat(this.name, this.state, this.currentCategoria)
      res.subscribe(res => {
        if(res){
          this._inveServ.notify('Categoría actualizada', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this._inveServ.notify('Ocurrio un error', 'error')
      }))
    }else{
      let res = this._inveServ.addCategoria(this.name)
      res.subscribe(res => {
        if(res){
          this._inveServ.notify('Categoría agregada', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this._inveServ.notify('Ocurrio un error', 'error')
      }))
    }
  }
}
