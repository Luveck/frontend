import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/interfaces/models';
import { InventarioService } from 'src/app/services/inventario.service';

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
    private _inveServ:InventarioService,
    public dialogo: MatDialogRef<DetalleCategoria>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data.catId){
      this.isLoadingResults = true
      const cat = this._inveServ.getCategoriaById(this.data.catId)
      cat?.subscribe((res:any) => {
        console.log(res)
        this.currentCategoria = res.result
        this.isLoadingResults = false
        this.name = this.currentCategoria.name
      }, (err => {
        console.log(err)
        this.isLoadingResults = false
        this._inveServ.notify('Ocurrio un error', 'error')
      }))
    }
  }

  save(){
    if(this.data.catId){
      const peticion = this._inveServ.updateCat(this.name, this.data.catId, this.currentCategoria.isDeleted)
      peticion?.subscribe(res => {
        if(res){
          this._inveServ.notify('Categoría actualizada', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this._inveServ.notify('Ocurrio un error', 'error')
      }))
    }else{
      const peticion = this._inveServ.addCategoria(this.name)
      peticion?.subscribe(res => {
        if(res){
          this._inveServ.notify('Categoría registrada', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        let msgError = err.error.messages
        this._inveServ.notify(`${msgError}`, 'error')
      }))
    }
  }
}
