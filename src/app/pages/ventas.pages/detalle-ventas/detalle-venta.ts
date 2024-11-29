import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect as MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Venta, Farmacia } from 'src/app/interfaces/models';
import { VentasService } from 'src/app/services/ventas.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PharmacySearchComponent } from '../pharmacy-search/pharmacy-search.component';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { FileValidator } from './FileValidator';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.html',
  styleUrls: ['./detalle-venta.scss'],
  providers:[FileValidator]
})
export class DetalleVenta implements OnInit, OnDestroy {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de Ventas',
        isLink: true,
        link: '/admin/ventas/ventas',
      },
      {
        name: 'Detalles de la venta',
        isLink: false,
      },
    ],
  };

  currentVenta!: Venta | any;
  currentVentaId: any;
  productsOnCurrentVenta: any[] = [];
  productos!: any[];
  farmacias!: Farmacia[];
  usuarios: any[] = [];
  userId!: string;
  isLoadingResults!: boolean;
  files: File[] = [];
  isOverDrop = false;

  public ventaForm = new FormGroup({
    pharmacyId: new FormControl('', Validators.required),
    noPurchase: new FormControl('', Validators.required),
    observation: new FormControl()
  });

  public userCtrl: FormControl<any> = new FormControl<any>(null);
  public userFilterCtrl: FormControl<string | null> = new FormControl<
    string | null
  >('');
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    public dialog: MatDialog,
    private readonly ventasServ: VentasService,
    private readonly inveServ: InventarioService,
    private readonly farmaServ: FarmaciasService,
    private readonly usersServ: UsuariosService,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    private readonly validator:FileValidator,

  ) {}

  ngOnInit(): void {
    const noPurchase = this.route.snapshot.params['noPurchase'];
    this.loadConfig();

    this.userFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterUsers();
    });

    if (noPurchase != 'new') {

    }
  }

  onQuantityChange(index: number) {
    const currentProduct = this.productsOnCurrentVenta[index];
    if (currentProduct.Quantity > 20) {
      currentProduct.Quantity = 20;
    }
  }

  public onSelectFile(event:any){
    console.log(this.validator.validateType(event.type))
    for(const item of event.target.files){
      if(this.validator.validateType(item.type)){
        this.files.push(item);
      }
    }
    console.log(event)
    console.log(this.files.length)
  }
  private async loadConfig() {
    try {
      await this.farmaServ.setPharmacies();
      await this.inveServ.setProducts();
      await this.usersServ.setUserCombo();
    } catch (error) {
      this.sharedService.notify('Error consultando la informacion', 'error');
    } finally {
      this.isLoadingResults = false;
      this.farmacias = this.farmaServ.getPharmacies();
      this.productos = this.inveServ.getProducts();
      this.usuarios = this.usersServ.getUserCombo();
      this.userCtrl.setValue(this.usuarios[1]);
      this.filteredUsers.next(this.usuarios.slice());
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  filterFharmacy(event: MouseEvent) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(PharmacySearchComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ventaForm.patchValue({
          pharmacyId: result.id,
        });
      }
    });
  }

  selectedUserId: string | null = null;
  selectedUser: any = null;

  onUserSelect(event: any) {
    const userId = event.value;
    this.selectedUser =
      this.usuarios.find((user) => user.userId === userId) || null;
  }

  protected filterUsers() {
    if (!this.usuarios) {
      return;
    }
    let search = this.userFilterCtrl.value?.trim()?.toLowerCase() || '';
    if (!search) {
      this.filteredUsers.next(this.usuarios.slice());
      return;
    }
    this.filteredUsers.next(
      this.usuarios.filter((user) => user.dni?.toLowerCase().includes(search))
    );
  }

  initValores() {
    this.ventaForm.patchValue({
      pharmacyId: this.currentVenta.pharmacyId,
      noPurchase: this.currentVenta.noPurchase,
    });
    const selectedUser = this.usuarios.find(
      (c) => c.id === this.currentVenta.userId
    );

    if (selectedUser) {
      this.userCtrl.setValue(selectedUser.id);
      this.userFilterCtrl.setValue(selectedUser.userName);
    }
  }

  resetForm() {
    this.ventaForm.reset();
  }

  save() {
    if (
      this.productsOnCurrentVenta.filter((product) =>
        product.hasOwnProperty('productId')
      ).length === 0
    ) {
      this.sharedService.notify(
        'La factura debe tener al menos un producto.',
        'info'
      );
      return;
    }

    if (this.currentVentaId) {

    } else {

    }
  }

  initProds(resultProds: any[]) {
    resultProds.map((prod) => {
      this.productsOnCurrentVenta.push({
        productId: prod.productId,
        Quantity: prod.quantity,
      });
    });
  }

  addProd() {
    this.productsOnCurrentVenta.push({
      Quantity: 1,
    });
  }

  eliminarProd(index: number) {
    this.productsOnCurrentVenta.splice(index, 1);
  }

  checkProdInArray(idprod: number): boolean {
    this.productsOnCurrentVenta.map((prod) => {
      prod.productId != idprod;
      return true;
    });
    return false;
  }
}
