import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSelect as MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Venta, Farmacia } from 'src/app/interfaces/models'
import { VentasService } from 'src/app/services/ventas.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.html',
  styleUrls: ['./detalle-venta.scss'],
})

export class DetalleVenta implements OnInit, OnDestroy {
  currentVenta!: Venta | any
  currentVentaId:any
  productsOnCurrentVenta: any[] = []
  productos!: any[]
  farmacias!: Farmacia[]
  usuarios: any[] = []
  userId!:string
  isLoadingResults!:boolean

  public ventaForm = new FormGroup({
    pharmacyId: new FormControl('', Validators.required),
    noPurchase: new FormControl('', Validators.required)
  })

  public userCtrl: FormControl<any> = new FormControl<any>(null);
  public userFilterCtrl: FormControl<string|null> = new FormControl<string|null>('');
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(
    private _ventasServ:VentasService,
    private _inveServ:InventarioService,
    private _farmaServ:FarmaciasService,
    private _usersServ:UsuariosService,
    public dialogo: MatDialogRef<DetalleVenta>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.ventaId){
      this.currentVentaId = this.data.ventaId
      this.currentVenta = this.data.currentVenta
      console.log(this.currentVenta)
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
    this.usuarios = this._usersServ.usersGlobal

    this.userCtrl.setValue(this.usuarios[1])
    this.filteredUsers.next(this.usuarios.slice());

    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUsers();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterUsers() {
    if (!this.usuarios) {
      return;
    }
    // get the search keyword
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.usuarios.slice());
      return;
    } else {
      search = search;
    }
    // filter the banks
    this.filteredUsers.next(
      this.usuarios.filter(user => user.userName.indexOf(search) > -1)
    );
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
      console.log(this.ventaForm.value)
      console.log(this.singleSelect.value)
      const peticionOne = this._usersServ.getUserByDNI(this.singleSelect.value)
      peticionOne.subscribe((resultOfUser:any) => {
        console.log(resultOfUser.result)
        let userId = resultOfUser.result.userEntity.id
        const peticionTwo = this._ventasServ.addVenta(this.ventaForm.value, userId)
        peticionTwo.subscribe((resultOfVenta:any) => {
          this.currentVentaId = resultOfVenta.result.id
          this.currentVenta = resultOfVenta.result
          this._inveServ.notify('Factura registrada.', 'success')
          this.addProd()
          //this.dialogo.close(true);
        })
      }, (err => {
        console.log(err)
        this._ventasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }
  }

  saveProds(){
    this._inveServ.notify('Factura actualizada.', 'success')
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
