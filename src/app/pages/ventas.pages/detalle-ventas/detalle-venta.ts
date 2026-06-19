import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PharmacySearchComponent } from 'src/app/components/pharmacy-search/pharmacy-search.component';
import { Farmacia, Venta } from 'src/app/interfaces/models';
import { CountryService } from 'src/app/services/country.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { SessionService } from 'src/app/services/session.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { VentasService } from 'src/app/services/ventas.service';
import { DetalleVentaConfig } from './detalle-venta.config';
import { FileValidator } from './FileValidator';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.html',
  styleUrls: ['./detalle-venta.scss'],
  providers: [FileValidator],
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
  files: Array<{
    base64: string;
    extension: string | undefined;
    name: string;
    type: string;
  }> = [];
  isOverDrop = false;
  private countryId = '';
  public config = DetalleVentaConfig;

  public ventaForm = new FormGroup({
    pharmacyId: new FormControl('', Validators.required),
    noPurchase: new FormControl('', Validators.required),
    observation: new FormControl(),
    userCtrl: new FormControl('', Validators.required),
  });

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
    private readonly sharedService: SharedService,
    private readonly validator: FileValidator,
    public readonly sessionService: SessionService,
    private readonly countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.countryService.countryId$.subscribe((country) => {
      this.countryId = country;
      this.loadConfig();
    });

    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUsers();
      });
  }

  public editPurchase() {
    const noPurchase = this.route.snapshot.params['noPurchase'];
    if (noPurchase != 'new') {
      this.getPurchase(noPurchase);
    }
  }

  private async getPurchase(noPurchase: any) {
    this.currentVenta = await this.ventasServ.getPurchaseById(noPurchase);
    this.initValores();
    this.isLoadingResults = false;
  }
  onQuantityChange(i: number) {
    if (this.productsOnCurrentVenta[i].Quantity > 20) {
      this.productsOnCurrentVenta[i].error = true;
    } else {
      this.productsOnCurrentVenta[i].error = false;
    }
  }

  private async loadConfig() {
    this.isLoadingResults = true;
    try {
      this.farmacias = await this.farmaServ.setPharmaciesBycountry(
        this.countryId
      );
      this.productos = await this.inveServ.setProductsByCountry(this.countryId);
      this.usuarios = await this.usersServ.setUserComboByCountry(
        this.countryId
      );
    } catch (error) {
      this.sharedService.notify('Error consultando la informacion', 'error');
    } finally {
      this.isLoadingResults = false;
      this.filteredUsers.next(this.usuarios.slice());
      if (this.sessionService.getUserData().pharmacyId != '0') {
        this.initFarm(this.sessionService.getUserData().pharmacyId);
      }
      this.editPurchase();
    }
  }

  private initFarm(pharmacyId: any) {
    this.ventaForm.patchValue({
      pharmacyId: pharmacyId,
    });
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
    this.selectedUser = event.value;
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

  get isVentaDisabled() {
    return this.currentVenta;
  }

  initValores() {
    this.ventaForm.patchValue({
      pharmacyId: this.currentVenta.pharmacyId,
      noPurchase: this.currentVenta.noPurchase,
      observation: this.currentVenta.observation,
      userCtrl: this.currentVenta.userId,
    });

    this.files.push({ name: '', base64: '', extension: '', type: '' });

    this.currentVenta.productPurchases.forEach((element: any) => {
      this.productsOnCurrentVenta.push({
        productId: element.productId,
        Quantity: element.quantity,
        state: element.state,
        observation: element.observation,
      });
    });

    this.selectedUser =
      this.usuarios.find((user) => user.userId === this.currentVenta.userId) ||
      null;

    if (this.selectedUser) {
      this.ventaForm.patchValue({ userCtrl: this.selectedUser });
    }

    if (this.isVentaDisabled) {
      this.ventaForm.get('noPurchase')?.disable();
      this.ventaForm.get('observation')?.disable();
    } else {
      this.ventaForm.get('noPurchase')?.enable();
      this.ventaForm.get('observation')?.enable();
    }
  }

  compareUsers(user1: any, user2: any): boolean {
    return user1 && user2 ? user1.userId === user2.userId : user1 === user2;
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

    if (this.currentVenta) {
      this.updatePurchase();
    } else {
      this.addPurchase();
    }
  }
  private async updatePurchase() {
    this.isLoadingResults = true;
    let purchase = this.createPurchase();
    purchase = {
      ...purchase,
      isActive: this.currentVenta.isActive,
      id: this.currentVenta.id,
    };
    await this.ventasServ.updatePurchase(purchase);
    this.isLoadingResults = false;
  }
  private createPurchase() {
    let products: any = [];

    this.productsOnCurrentVenta.forEach((element) => {
      products.push({
        productId: element.productId,
        Quantity: element.Quantity,
      });
    });

    let user: any = this.ventaForm.value.userCtrl;
    let purchase: any = {
      pharmacyId: this.ventaForm.value.pharmacyId,
      userId: user.userId,
      noPurchase: this.ventaForm.value.noPurchase,
      purchaseReviewed: false,
      dateShiped: new Date().toISOString(),
      countryId: '1',
      observation: this.ventaForm.value.observation,
      file: this.files[0].base64.toString(),
      fileExtension: this.files[0].extension,
      products: products,
    };
    return purchase;
  }
  private async addPurchase() {
    this.isLoadingResults = true;
    let purchase = this.createPurchase();
    purchase = {
      ...purchase,
      isActive: true,
    };
    await this.ventasServ.addPurchase(purchase);
    this.isLoadingResults = false;
  }

  addProd() {
    this.productsOnCurrentVenta.push({
      productId: null,
      Quantity: 1,
    });
  }

  eliminarProd(index: number) {
    this.productsOnCurrentVenta.splice(index, 1);
  }

  availableProducts(index: number) {
    const selectedProducts = this.productsOnCurrentVenta
      .filter((_, i) => i !== index)
      .map((p) => p.productId);
    return this.productos.filter((prod) => !selectedProducts.includes(prod.id));
  }

  canAddProduct(): boolean {
    if (this.productsOnCurrentVenta.length === 0) return true;
    const lastProduct =
      this.productsOnCurrentVenta[this.productsOnCurrentVenta.length - 1];
    return lastProduct.productId && lastProduct.Quantity > 0;
  }

  onProductChange(index: number) {
    const currentProduct = this.productsOnCurrentVenta[index];
    if (!currentProduct.Quantity) {
      currentProduct.Quantity = 1;
    }
  }

  isProductsValid(): boolean {
    if (this.productsOnCurrentVenta.length === 0) {
      return false;
    }

    return this.productsOnCurrentVenta.every(
      (product) =>
        product.productId !== null &&
        product.productId !== undefined &&
        product.Quantity > 0 &&
        product.Quantity <= 20
    );
  }

  seePurchase() {
    window.open(this.currentVenta.urlPurchase, '_blank');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isOverDrop = true;
  }

  onDragLeave() {
    this.isOverDrop = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isOverDrop = false;

    if (event.dataTransfer?.files.length) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onSelectFile(event: any) {
    this.handleFiles(event.target.files);
  }

  private handleFiles(files: FileList) {
    for (const file of Array.from(files)) {
      if (this.validator.validateType(file.type)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result.split(',')[1];
          const extension = file.name.split('.').pop();
          this.files.push({
            base64: base64String,
            extension: extension,
            name: file.name,
            type: file.type,
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
