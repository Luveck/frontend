import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { VentasService } from 'src/app/services/ventas.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { Farmacia, Venta } from 'src/app/interfaces/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-canje',
  templateUrl: './canje.component.html',
  styleUrls: ['./canje.component.scss']
})
export class CanjeComponent implements OnInit {
  productsOnCurrentVenta: any[] = []
  productos!: any[]
  farmacias!: Farmacia[]
  currentVenta!: Venta | any
  currentVentaId:any
  isLoadingResults!:boolean

  public ventaForm = new FormGroup({
    pharmacyId: new FormControl('', Validators.required),
    noPurchase: new FormControl('', Validators.required)
  })

  constructor(
    private _ventasServ:VentasService,
    private _inveServ:InventarioService,
    private _farmaServ:FarmaciasService,
    public authServ:AuthService
  ) { }

  ngOnInit(): void {
    const peticion1 = this._farmaServ.getFarmacias()
    peticion1.subscribe((res:any) => {
      this.farmacias = res.result
    })
    const peticion2 = this._inveServ.getProductos()
    peticion2.subscribe((res:any) => {
      this.productos = res.result
    })
  }

  resetForm(){
    this.ventaForm.reset()
  }

  save(){
    console.log(this.ventaForm.value)
    const peticionFact = this._ventasServ.addVenta(this.ventaForm.value, this.authServ.userData.UserId)
    peticionFact.subscribe((resultOfVenta:any) => {
      this.currentVentaId = resultOfVenta.result.id
      this.currentVenta = resultOfVenta.result
      this._inveServ.notify('Factura registrada.', 'success')
      this.addProd()
      //this.dialogo.close(true);
    })
  }

  addProd(){
    this.productsOnCurrentVenta.push(
      {
        "productId": 1,
        "quantityShiped": 0,
        "dateShiped": "2023-03-29T16:51:02.562Z"
      }
    )
    console.log(this.productsOnCurrentVenta)
  }

  eliminarProd(index:number){
    this.productsOnCurrentVenta.splice(index, 1)
  }
}
