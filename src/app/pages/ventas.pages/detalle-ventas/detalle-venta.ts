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
  files: Array<{ base64: string; extension: string; name: string; type: string }> = [];
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
      this.getPurchase(noPurchase);
    }
  }

  private async getPurchase(noPurchase: any) {
    try {
      this.currentVenta = await this.apiService.get(`Purchase/id/${noPurchase}`)
      console.log(this.currentVenta)
      this.initValores();

    } catch (error) {
      this.sharedService.notify('Error consultando la informacion', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }
  onQuantityChange(index: number) {
    const currentProduct = this.productsOnCurrentVenta[index];
    if (currentProduct.Quantity > 20) {
      currentProduct.Quantity = 20;
    }
  }

  public onSelectFile(event:any){
    for(const file of event.target.files){
      if(this.validator.validateType(file.type)){
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result.split(',')[1];
          const extension = file.name.split('.').pop();
          this.files.push({
            base64: base64String,
            extension: extension,
            name: file.name,
            type: file.type
          });
        };
        reader.readAsDataURL(file);
      }
    }
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
      console.log("Editar factura")
    } else {
      this.addPurchase();
    }
  }

  private createPurchase(){
    var products: any =  [];

    this.productsOnCurrentVenta.forEach(element => {
      products.push({
        productId: element.productId,
        Quantity: element.quantity
      })
    });
    var purchase: any = {
      pharmacyId: this.ventaForm.value.pharmacyId,
      userId: this.selectedUser.id,
      noPurchase: this.ventaForm.value.noPurchase,
      purchaseReviewed: false,
      dateShiped: new Date().toISOString(),
      countryId: '1',
      observation: this.ventaForm.value.observation,
      file: this.files[0].base64.toString(),
      fileExtension: this.files[0].extension,
      products: products
    }

    purchase = this.sharedService.addIpDevice(purchase);
    return purchase;
  }
  private async addPurchase(){
    try {
      let purchase = this.createPurchase();
      purchase = {
        ...purchase,
        isActive: true,
      }
      await this.apiService.post('Purchase/CreatePruchase', purchase);
      this.sharedService.notify('Factura agregado', 'success');
    } catch (error) {
      this.sharedService.notify('Error agregado la factura', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }
  // initProds(resultProds: any[]) {
  //   resultProds.map((prod) => {
  //     this.productsOnCurrentVenta.push({
  //       productId: prod.productId,
  //       Quantity: prod.quantity,
  //     });
  //   });
  // }

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
    const lastProduct = this.productsOnCurrentVenta[this.productsOnCurrentVenta.length - 1];
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
}
