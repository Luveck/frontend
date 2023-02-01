import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Categoria, Producto } from 'src/app/interfaces/models'
import { InventarioService } from 'src/app/services/inventario.service'

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.html',
  styleUrls: ['./detalle-producto.scss'],
})

export class DetalleProducto implements OnInit {
  currentProd!: Producto | any
  cats!: Categoria[]
  isLoadingResults!:boolean

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
    public dialogo: MatDialogRef<DetalleProducto>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(!this._inveServ.categorias){
      const res = this._inveServ.getCategories()
      res.subscribe(res => this.cats = res.result)
    }else{
      this.cats = this._inveServ.categorias
    }

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
        this._inveServ.notify('Ocurrio un error con la petición', 'error')
      }))
    }
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
      const peticion = this._inveServ.updateProd(this.prodForm.value, this.data.productoId, this.currentProd.state)
      peticion.subscribe(() => {
        this._inveServ.notify('Registro actualizado', 'success')
        this.dialogo.close(true)
      }, err => {
        console.log(err)
        this._inveServ.notify('Ocurrio un error', 'error')
      })
    }else{
      const peticion = this._inveServ.addProducto(this.prodForm.value)
      peticion.subscribe(() => {
        this._inveServ.notify('Producto registrado', 'success')
        this.dialogo.close(true)
      }, err => {
        console.log(err)
        this._inveServ.notify('Ocurrio un error', 'error')
      })
    }
  }
}
