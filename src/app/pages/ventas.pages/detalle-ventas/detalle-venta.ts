import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Venta, Producto, Farmacia } from 'src/app/interfaces/models'
import { VentasService } from 'src/app/services/ventas.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.html',
  styleUrls: ['./detalle-venta.scss'],
})

export class DetalleVenta implements OnInit {
  currentVenta!: Venta | any
  productsOnCurrentVenta!: any[]
  productos!: Producto[]
  farmacias!: Farmacia[]
  isLoadingResults!:boolean

  public ventaForm = new FormGroup({
    pharmacyId: new FormControl('', Validators.required),
    noPurchase: new FormControl('', Validators.required)
  })

  constructor(
    private _ventasServ:VentasService,
    private _inveServ:InventarioService,
    private _farmaServ:FarmaciasService,
    public dialogo: MatDialogRef<DetalleVenta>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.ventaId){
      this.currentVenta = this.data.currentVenta
      this.initValores()
      this.isLoadingResults = true
      const products = this._ventasServ.getProductosOfVenta(this.data.ventaId)
      products.subscribe(res => {
        console.log(res)
        this.productsOnCurrentVenta = res.result
        this.isLoadingResults = false
      }, (err => {
        console.log(err)
        this.isLoadingResults = false
        this._ventasServ.notify('Ocurrio un error con la petición', 'error')
      }))
    }
    this.farmacias = this._farmaServ.listFarmacias
    this.productos = this._inveServ.listProducts
  }

  initValores(){
    this.ventaForm.patchValue({
      pharmacyId: this.currentVenta.idPharmacy,
      noPurchase: this.currentVenta.noPurchase
    })
  }

  resetForm(){
    this.ventaForm.reset()
  }

  save(){
    if(this.data.ventaId){
      const peticion = this._ventasServ.updateVenta(this.ventaForm.value, this.data.ventaId, this.currentVenta.reviewed)
      peticion.subscribe(() => {
        this._ventasServ.notify('Registro actualizado', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._ventasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }else{
      const peticion = this._ventasServ.addVenta(this.ventaForm.value)
      peticion.subscribe(() => {
        this._inveServ.notify('Venta registrada', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._ventasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }
  }
}
