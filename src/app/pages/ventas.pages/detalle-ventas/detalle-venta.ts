import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSelect as MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Venta, Farmacia } from 'src/app/interfaces/models'
import { VentasService } from 'src/app/services/ventas.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.html',
  styleUrls: ['./detalle-venta.scss'],
})

export class DetalleVenta implements OnInit, OnDestroy {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de Ventas',
        isLink: true,
        link: '/admin/ventas/ventas'
      },
      {
        name: 'Detalles de la venta',
        isLink: false,
      }
    ]
  }

  currentVenta!: Venta | any
  currentVentaId:any
  productsOnCurrentVenta: any[] = []
  //productsExcludedCurrentVenta: any[] = []
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

  protected _onDestroy = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _ventasServ:VentasService,
    private _inveServ:InventarioService,
    private _farmaServ:FarmaciasService,
    private _usersServ:UsuariosService
  ){}

  ngOnInit(): void {
    const noPurchase = this._route.snapshot.params['noPurchase']
    const buyer = this._route.snapshot.params['buyer']

    if(noPurchase != 'new'){
      this.isLoadingResults = true
      const peticion = this._ventasServ.getVentaByNoPurchaseAndIdUser(noPurchase, buyer)
      peticion?.subscribe((res:any) => {
        console.log(res.result)
        this.currentVentaId = res.result[0].id
        this.currentVenta = res.result[0]
        this.initValores()
        const products = this._ventasServ.getProductosOfVenta(this.currentVentaId)
        products?.subscribe(res => {
          console.log(res)
          this.initProds(res.result)
          this.isLoadingResults = false
          this.ventaForm.disable()
          this.userCtrl.disable()
        })
      },(err => {
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
    if(this.currentVentaId){
      const peticion = this._ventasServ.updateVenta(this.ventaForm.value, this.currentVentaId, this.currentVenta.reviewed)
      peticion?.subscribe(() => {
        this._ventasServ.notify('Registro actualizado', 'success')
      }, (err => {
        console.log(err)
        this._ventasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }else{
      const peticion = this._ventasServ.addVenta(this.ventaForm.value, this.singleSelect.value)
      peticion?.subscribe((resultOfVenta:any) => {
        this.currentVentaId = resultOfVenta.result.id
        this.currentVenta = resultOfVenta.result
        this._inveServ.notify('Factura registrada.', 'success')
        this.ventaForm.disable()
        this.userCtrl.disable()
        this.addProd()
      },(err => {
        console.log(err)
        this._ventasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }
  }

  initProds(resultProds:any[]){
    resultProds.map(prod => {
      this.productsOnCurrentVenta.push(
        {
          "productId": prod.productId,
          "quantityShiped": prod.quantityShiped,
          "dateShiped": prod.dateShiped
        }
      )
    })
  }

  saveProds(){
    if(this.productsOnCurrentVenta.length === 0){
      this._inveServ.notify('La factura debe tener al menos un producto.', 'info')
      return
    }
    const peticion = this._ventasServ.addProducToVenta(this.currentVentaId, this.productsOnCurrentVenta)
    peticion?.subscribe((res:any)=>{
      this._inveServ.notify('Factura actualizada.', 'success')
      console.log(res)
    })
  }

  addProd(){
/*     this.productsExcludedCurrentVenta = this.productsOnCurrentVenta.map(prod => {
      let prodTem = this.productos.find(product => product.id === prod.productId)
      return prodTem.id
    })

    console.log(this.productsExcludedCurrentVenta) */

    this.productsOnCurrentVenta.push(
      {
        "quantityShiped": 1,
        "dateShiped": "2023-03-29T16:51:02.562Z"
      }
    )
  }

  eliminarProd(index:number){
    this.productsOnCurrentVenta.splice(index, 1)
  }

  checkProdInArray(idprod:number):boolean{
    this.productsOnCurrentVenta.map(prod => {
      console.log(prod.productId)
      prod.productId != idprod
      return true
    })
    return false
  }
}
