import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Venta, Farmacia } from 'src/app/interfaces/models';
import { VentasService } from 'src/app/services/ventas.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PharmacySearchComponent } from '../../../components/pharmacy-search/pharmacy-search.component';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { FileValidator } from './FileValidator';
import { SessionService } from 'src/app/services/session.service';
import { ExchangeDetialConfig } from './exchange-detail.config';
import { Product } from 'src/app/entities/product.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { CountryService } from 'src/app/services/country.service';
import { ResponseService } from 'src/app/entities/response.entity';

@Component({
  selector: 'app-exchange-detail',
  templateUrl: './exchange-detail.html',
  styleUrls: ['./exchange-detail.scss'],
  providers: [FileValidator],
})
export class ExchangeDetail implements OnInit, OnDestroy {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de Canjes',
        isLink: true,
        link: '/admin/canje/canje',
      },
      {
        name: 'Detalles de Canje',
        isLink: false,
      },
    ],
  };

  public config = ExchangeDetialConfig;
  public products: any[] = [];
  public product: any | null = null;

  public productsFilter: FormControl<string | null> = new FormControl<
    string | null
  >('');
  public filteredProduct: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public userFilterCtrl: FormControl<string | null> = new FormControl<
    string | null
  >('');
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public quantity = 0;

  // pendiente eliminar
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
    extension: string;
    name: string;
    type: string;
  }> = [];
  isOverDrop = false;
  private countryId = '';

  public ventaForm = new FormGroup({
    pharmacyId: new FormControl('', Validators.required),
    userCtrl: new FormControl('', Validators.required),
  });

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly route: Router,
    public dialog: MatDialog,
    private readonly ventasServ: VentasService,
    private readonly farmaServ: FarmaciasService,
    private readonly usersServ: UsuariosService,
    private readonly sharedService: SharedService,
    public readonly sessionService: SessionService,
    private readonly exchangeService: ExchangeService,
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

  private async loadConfig() {
    try {
      await this.farmaServ.setPharmaciesBycountry(this.countryId);
      await this.usersServ.setUserComboByCountry(this.countryId);
    } catch (error) {
      this.sharedService.notify('Error consultando la informacion', 'error');
    } finally {
      this.isLoadingResults = false;
      this.farmacias = this.farmaServ.getPharmacies();
      this.usuarios = this.usersServ.getUserCombo();
      this.filteredUsers.next(this.usuarios.slice());
      this.filteredProduct.next(this.products.slice());
      if (this.sessionService.getUserData().pharmacyId != '0') {
        this.initFarm(this.sessionService.getUserData().pharmacyId);
      }
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
    this.isLoadingResults = true;
    this.selectedUser = event.value;
    this.getProductsUser();
    this.isLoadingResults = false;
    this.product = null;
  }

  private async getProductsUser() {
    const data = await this.exchangeService.GetProductExchangeByUser(
      this.selectedUser.userId
    );
    this.products = data as any;
    this.filteredProduct.next(this.products.slice());

    this.productsFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProducts();
      });
  }

  onProductSelect(event: any) {
    this.product = event.value;
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

  protected filterProducts() {
    if (!this.products) {
      return;
    }
    let search = this.productsFilter.value?.trim()?.toLowerCase() || '';
    if (!search) {
      this.filteredProduct.next(this.products.slice());
      return;
    }
    this.filteredProduct.next(
      this.products.filter((prod) => prod.name?.toLowerCase().includes(search))
    );
  }

  initValores() {
    this.ventaForm.patchValue({
      pharmacyId: this.currentVenta.pharmacyId,
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
  }

  compareUsers(user1: any, user2: any): boolean {
    return user1 && user2 ? user1.userId === user2.userId : user1 === user2;
  }
  resetForm() {
    this.ventaForm.reset();
    this.product = null;
  }

  save() {
    this.addExchange();
  }

  private async addExchange() {
    this.isLoadingResults = true;
    let exchange = this.createExchange();
    const response = (await this.exchangeService.addExchange(
      exchange
    )) as ResponseService;

    this.isLoadingResults = false;

    if (response?.wasSuccessful) {
      this.route.navigate(['admin/canjes/canjes']);
    }
  }
  private createExchange() {
    return {
      userId: this.selectedUser.userId,
      productId: this.product.productId,
      quantityExchange: this.quantity,
      userIdApproval: this.sessionService.getUserData().UserId,
      pharmacyId: this.ventaForm.get('pharmacyId')?.value,
    };
  }
  seePurchase() {
    window.open(this.currentVenta.urlPurchase, '_blank');
  }

  public checkQuantity() {
    if (
      !this.product ||
      this.product?.quantityToExchange < this.quantity ||
      this.quantity < 1
    ) {
      return true;
    }
    return false;
  }
}
