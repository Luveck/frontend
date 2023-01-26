import { Component, Inject, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';

import { Categoria, Producto } from 'src/app/interfaces/models'
import { InventarioService } from 'src/app/services/inventario.service'

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})

export class DetalleProductoPage implements OnInit {
  currentProd!: Producto | any
  cats!: Categoria[]
  categoriaTemp!: Categoria
  isLoadingResults?:boolean

  public prodForm = new FormGroup({
    name: new FormControl('', Validators.required),
    barcode: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    presentation: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    typeSell: new FormControl('', Validators.required),
    cost: new FormControl('', Validators.required),
    idCategory: new FormControl('',Validators.required),
  })

  constructor(
    private _inveServ: InventarioService,
    private _dialogo:MatDialog,
    public dialogo: MatDialogRef<DetalleProductoPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.productoId){
      this.isLoadingResults = true
      const prod = this._inveServ.getProductoById(this.data.productoId)
      prod.subscribe(res => {
        console.log(res)
        this.currentProd = res.result
        this.isLoadingResults = false
        this.initValores()
      }, (err => {
        console.log(err)
        this.isLoadingResults = false
        this._inveServ.notify('Ocurrio un error', 'error')
      }))
    }
    this.cats = this._inveServ.categorias
  }

  initValores(){
    this.prodForm.patchValue({
      name: this.currentProd.name,
      barcode: this.currentProd.barcode,
      description: this.currentProd.description,
      presentation: this.currentProd.presentation,
      quantity: this.currentProd.quantity,
      typeSell: this.currentProd.typeSell,
      cost: this.currentProd.cost,
      idCategory: this.currentProd.idCategory
    })
  }

  resetForm(){
    this.prodForm.reset()
  }

  save(){
    if(this.data.productoId){
      const peticion = this._inveServ.updateProd(this.prodForm.value, this.currentProd.state, this.data.productoId)
      peticion.subscribe(res => {
        this._inveServ.notify('Registro actualizado', 'success')
        this.dialogo.close()
      }, err => {
        console.log(err)
        this._inveServ.notify('Ocurrio un error', 'error')
      })
    }else{
      const peticion = this._inveServ.addProducto(this.prodForm.value)
      peticion.subscribe(res => {
        this._inveServ.notify('Producto registrado', 'success')
        this.dialogo.close()
      }, err => {
        console.log(err)
        this._inveServ.notify('Ocurrio un error', 'error')
      })
    }
  }

  chageState(state:boolean){
    let msgDialog:string
    if(state){
      msgDialog = '¿Seguro de querer inhabilitar este producto?'
    }else{
      msgDialog = '¿Seguro de querer habilitar este producto?'
    }
    this._dialogo.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        this.currentProd.state = !state
        const res = this._inveServ.updateProd(this.prodForm.value, this.currentProd.state, this.data.productoId)
          res.subscribe(res => {
            if(res){
              this._inveServ.notify('Producto actualizado', 'success')
            }
          }, (err => {
            console.log(err)
            this._inveServ.notify('Ocurrio un error', 'error')
          }))
      }
    })
  }
}
