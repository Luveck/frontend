import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { VentasService } from 'src/app/services/ventas.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { Farmacia, Venta } from 'src/app/interfaces/models';
import { AuthService } from 'src/app/services/auth.service';
import { PharmacySearchComponent } from 'src/app/pages/ventas.pages/pharmacy-search/pharmacy-search.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-canje',
  templateUrl: './canje.component.html',
  styleUrls: ['./canje.component.scss'],
})
export class CanjeComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  // @Output() sectionEvent = new EventEmitter<string>();
  // productsOnCurrentVenta: any[] = [];
  // productos!: any[];
  // farmacias!: Farmacia[];
  // currentVenta!: Venta | any;
  // currentVentaId: any;
  // isLoadingResults!: boolean;
  // public ventaForm = new FormGroup({
  //   pharmacyId: new FormControl('', Validators.required),
  //   noPurchase: new FormControl('', Validators.required),
  // });
  // constructor(
  //   private _ventasServ: VentasService,
  //   private _inveServ: InventarioService,
  //   private _farmaServ: FarmaciasService,
  //   public authServ: AuthService,
  //   public dialog: MatDialog
  // ) {}
  // ngOnInit(): void {
  //   if (!this.authServ.checkTokenDate(this.authServ.expToken)) {
  //     this.authServ.showSesionEndModal();
  //     this.sectionEvent.emit('inicio');
  //     return;
  //   }
  //   // const peticion2 = this._inveServ.getProductos();
  //   // peticion2?.subscribe((res: any) => {
  //   //   this.productos = res.result;
  //   // });
  //   // this.zonas.getDepartamentos()?.subscribe((res) => {
  //   //   this.zonas.listDepartamentos = res.result;
  //   // });
  //   // this.zonas.getCiudades()?.subscribe((res) => {
  //   //   this.zonas.listCiudades = res.result;
  //   // });
  //   // this._farmaServ.getFarmacias()?.subscribe((res) => {
  //   //   this._farmaServ.listFarmacias = res.result;
  //   //   this.farmacias = res.result;
  //   // });
  // }
  // resetForm() {
  //   this.ventaForm.reset();
  // }
  // save() {
  //   if (
  //     this.productsOnCurrentVenta.filter((product) =>
  //       product.hasOwnProperty('productId')
  //     ).length === 0
  //   ) {
  //     // this._inveServ.notify(
  //     //   'La factura debe tener al menos un producto.',
  //     //   'info'
  //     // );
  //     return;
  //   }
  //   // const peticion = this._ventasServ.addVenta(
  //   //   this.ventaForm.value,
  //   //   // this.authServ.userData.UserId,
  //   //   this.productsOnCurrentVenta
  //   // );
  //   // peticion?.subscribe(
  //   //   (resultOfVenta: any) => {
  //   //     this.currentVentaId = resultOfVenta.result.id;
  //   //     this.currentVenta = resultOfVenta.result;
  //   //     this._inveServ.notify('Factura registrada.', 'success');
  //   //     this.ventaForm.disable();
  //   //     this.addProd();
  //   //   },
  //   //   (err) => {
  //   //     this._ventasServ.notify(
  //   //       err.error.result == 'La factura que desea registrar ya existe.'
  //   //         ? err.error.result
  //   //         : 'Ocurrio un error con el proceso',
  //   //       'error'
  //   //     );
  //   //   }
  //   // );
  // }
  // addProd() {
  //   this.productsOnCurrentVenta.push({
  //     Quantity: 1,
  //   });
  // }
  // eliminarProd(index: number) {
  //   this.productsOnCurrentVenta.splice(index, 1);
  // }
  // filterFharmacy(event: MouseEvent) {
  //   event.stopPropagation();
  //   const dialogRef = this.dialog.open(PharmacySearchComponent, {});
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.ventaForm.patchValue({
  //         pharmacyId: result.id,
  //       });
  //     }
  //   });
  // }
}
