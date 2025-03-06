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
import { ExchangeService } from 'src/app/services/exchange.service';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { FormControl, FormGroup } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.page.html',
  styleUrls: ['./exchange.page.scss'],
})
export class ExchangePage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de Redención',
        isLink: false,
      },
    ],
  };

  @Input('ELEMENT_DATA') ELEMENT_DATA!: Venta[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort | null;
  displayedColumns: string[] = [
    'ExchangeDate',
    'State',
    'UserApproval',
    'UserExchange',
    'PharmacyName',
    'QuantityGiven',
  ];
  dataSource = new MatTableDataSource<Venta>(this.ELEMENT_DATA);

  isLoadingResults: boolean = true;
  public filter: FilterPurchase = {} as FilterPurchase;
  public countryId: string = '';
  public pharmacies!: any[];
  public filterPharmacies: any[] = [];
  public exchanges!: any[];
  public filterExchanges: any[] = [];
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dataServ: DataService,
    private _dialog: MatDialog,

    private readonly sharedService: SharedService,
    public readonly sessionService: SessionService,
    private readonly countryService: CountryService,
    private readonly exchangeService: ExchangeService,
    private readonly pharamcyService: FarmaciasService
  ) {
    this.filter.pharmacyId =
      sessionService.getUserData().pharmacyId == '0'
        ? null
        : sessionService.getUserData().pharmacyId;
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.countryService.countryId$.subscribe((country) => {
      this.filter.countryId = country;
      this.getExchanges();
    });

    if (this.sessionService.getUserData().Role == 'Admin') {
      this.displayedColumns = [...this.displayedColumns, 'acctions'];
    }

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
    this.getExchanges();
  }
  private async getExchanges() {
    await this.exchangeService.setExchangesFiltered(this.filter);
    this.isLoadingResults = false;
    this.exchanges = this.exchangeService.getExchanges();
    this.filterExchanges = [...this.exchanges];
    this.dataSource.data = this.exchanges;
    this.dataSource.data = this.dataSource.data.sort((a) => {
      if (a.reviewed) return 0;
      else return 1;
    });

    if (this.sessionService.getUserData().pharmacyId == '0') {
      this.pharmacies = await this.pharamcyService.setPharmaciesBycountry(
        this.filter.countryId
      );
      this.filterPharmacies = [...this.pharmacies];
    }
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
    this._dataServ.goTo(`admin/canjes/details-canje/${noPurchase}/${buyer}`);
  }

  revers(row: any) {
    this.exchangeService.ReversExchangeAsync(row);
    this.getExchanges();
  }

  give(row: any) {
    this.exchangeService.GiveExchangeAsync(row);
    this.getExchanges();
  }

  generateReport() {
    // this._dialog.open(ModalReportComponent, {
    //   disableClose: true,
    //   data: {
    //     title: 'Reporte General de Ventas',
    //     body: this.dataSource.data,
    //   },
    // });
  }

  public filterByFharmacy(event: Event) {
    this.exchanges = this.filterExchanges.filter(
      (p) => p.pharmacyId === Number(event)
    );

    this.dataSource.data = this.exchanges;
    this.dataSource.data = this.dataSource.data.sort((a) => {
      if (a.reviewed) return 0;
      else return 1;
    });
  }
}
