import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Venta } from 'src/app/interfaces/models';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { VentasService } from 'src/app/services/ventas.service';
import { DataService } from 'src/app/services/data.service';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { SharedService } from 'src/app/services/shared.service';
import { FilterPurchase } from 'src/app/entities/filter-purchases.entiy';
import { SessionService } from 'src/app/services/session.service';
import { CountryService } from 'src/app/services/country.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { FormControl, FormGroup } from '@angular/forms';
import { filter } from 'rxjs';
import { UserRoles } from 'src/app/shared/enums/roles.enum';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements AfterViewInit, OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de Ventas',
        isLink: false,
      },
    ],
  };

  @Input('ELEMENT_DATA') ELEMENT_DATA!: Venta[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort | null;
  displayedColumns: string[] = [
    'noPurchase',
    'dniiUser',
    'UserFullName',
    'namePharmacy',
    'creationDate',
    'acctions',
  ];
  dataSource = new MatTableDataSource<Venta>(this.ELEMENT_DATA);

  isLoadingResults: boolean = true;
  public filter: FilterPurchase = {} as FilterPurchase;
  selectedCountry: string = '';
  selectedCountryId: string = '';
  public pharmacies!: any[];
  public filterPharmacies: any[] = [];
  public purchases!: any[];
  public filterPurchases: any[] = [];
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dataServ: DataService,

    private readonly dialog: MatDialog,
    private readonly ventasService: VentasService,
    private readonly sharedService: SharedService,
    private readonly sessionService: SessionService,
    private readonly countryService: CountryService,
    private readonly pharamcyService: FarmaciasService
  ) {
    this.filter.pharmacyId =
      sessionService.getUserData().pharmacyId == '0'
        ? null
        : sessionService.getUserData().pharmacyId;
    this.filter.countryId = sessionService.getUserData().countryId;
  }

  ngOnInit(): void {
    this.countryService.countryId$.subscribe((country) => {
      this.filter.countryId = country;
      this.getPurchases();
    });

    this.range.valueChanges
      .pipe(filter((value: any) => value.start && value.end))
      .subscribe((value) => {
        this.consultarDatos(value.start, value.end);
      });
  }

  consultarDatos(start: Date, end: Date) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays > 60) {
      this.sharedService.notify('No puede filtrar mas de 60 dias.', 'error');
      return;
    }

    this.filter.dateBuyStart = startDate.toISOString();
    this.filter.dateBuyEnd = endDate.toISOString();
    this.getPurchases();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private async getPurchases() {
    await this.ventasService.setPurchasesFiltered(this.filter);
    this.isLoadingResults = false;
    this.purchases = await this.ventasService.getPurchases();
    this.filterPurchases = [...this.purchases];
    this.dataSource.data = this.purchases;
    this.dataSource.data = this.dataSource.data.sort((a) => {
      if (a.reviewed) return 0;
      else return 1;
    });
    this.pharmacies = await this.pharamcyService.setPharmaciesBycountry(
      this.filter.countryId
    );
    this.filterPharmacies = [...this.pharmacies];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  on(noPurchase?: string, buyer?: string) {
    this._dataServ.goTo(`admin/ventas/venta-detalle/${noPurchase}/${buyer}`);
  }

  revers(row: any) {
    this.dialog
      .open(DialogConfComponent, {
        data: `¿Está seguro de anular la venta?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.cancelPurchase(row);
          this.getPurchases();
        }
      });
  }

  public async cancelPurchase(row: any) {
    this.isLoadingResults = true;
    await this.ventasService.cancelPurchase(row.id);
    this.isLoadingResults = false;
  }

  public checkCancel(row: any) {
    if (row.state == 'Anulada') {
      return false;
    }
    if (this.sessionService.getUserData().Role === UserRoles.Admin.toString()) {
      return true;
    }
    const dateShiped = new Date(row.dateShiped);
    const dateToday = new Date();
    const differenceInMillis = dateToday.getTime() - dateShiped.getTime();
    const differenceInHours = differenceInMillis / (1000 * 60 * 60);
    if (
      this.sessionService.getUserData().Role ===
        UserRoles.PharmacyUser.toString() &&
      differenceInHours < 48
    ) {
      return true;
    }

    return false;
  }

  generateReport() {
    this.dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        title: 'Reporte General de Ventas',
        body: this.dataSource.data,
      },
    });
  }

  public filterByFharmacy(event: Event) {
    this.purchases = this.filterPurchases.filter(
      (p) => p.pharmacyId === Number(event)
    );

    this.dataSource.data = this.purchases;
    this.dataSource.data = this.dataSource.data.sort((a) => {
      if (a.reviewed) return 0;
      else return 1;
    });
  }
}
