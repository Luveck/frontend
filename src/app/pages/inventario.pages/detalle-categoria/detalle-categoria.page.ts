import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Categoria } from 'src/app/interfaces/models';
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-detalle-categoria',
  templateUrl: './detalle-categoria.page.html',
  styleUrls: ['./detalle-categoria.page.scss']
})
export class DetalleCategoriaPage implements OnInit {
  currentCategoria!: Categoria | any;
  name!: string
  state!: boolean
  isLoadingResults?:boolean

  constructor(
    private _inveServ:InventarioService,
    private _dialogo:MatDialog,
    public dialogo: MatDialogRef<DetalleCategoriaPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data.catId){
      this.isLoadingResults = true
      const cat = this._inveServ.getCategoriaById(this.data.catId)
      cat.subscribe(res => {
        console.log(res)
        this.currentCategoria = res.result
        this.isLoadingResults = false
        this.name = this.currentCategoria.name
        this.state = this.currentCategoria.isDeleted
      }, (err => {
        console.log(err)
        this.isLoadingResults = false
        this._inveServ.notify('Ocurrio un error', 'error')
      }))
    }
  }

  save(){
    if(this.data.catId){
      const res = this._inveServ.updateCat(this.name, this.state, this.data.catId)
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
      const res = this._inveServ.addCategoria(this.name)
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

  chageState(state:boolean){
    let msgDialog:string
    if(!state){
      msgDialog = '¿Seguro de querer inhabilitar esta categoría?'
    }else{
      msgDialog = '¿Seguro de querer habilitar esta categoría?'
    }
    this._dialogo.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        this.state = !this.state
        const res = this._inveServ.updateCat(this.name, this.state, this.data.catId)
          res.subscribe(res => {
            if(res){
              this._inveServ.notify('Categoría actualizada', 'success')
              this.currentCategoria.isDeleted = !state
            }
          }, (err => {
            console.log(err)
            this._inveServ.notify('Ocurrio un error', 'error')
          }))
      }
    })
  }
}
