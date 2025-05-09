import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ExchangeService } from 'src/app/services/exchange.service';
import { SessionService } from 'src/app/services/session.service';
import { CanjeConfig } from './canje.config';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { filter } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { FilterPurchase } from 'src/app/entities/filter-purchases.entiy';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-canje',
  templateUrl: './canje.component.html',
  styleUrls: ['./canje.component.scss'],
})
export class CanjeComponent implements OnInit, AfterViewInit {
  public exchanges!: any;
  public isLoadingResults?: boolean;
  public config = CanjeConfig;
  public dataSource = new MatTableDataSource<any>();
  public filter: FilterPurchase = {} as FilterPurchase;
  public filterExchanges: any[] = [];
  public pharmacies!: any[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private readonly sessionService: SessionService,
    private readonly exchangeService: ExchangeService,
    private readonly sharedService: SharedService,
    private readonly pharmacyService: FarmaciasService,
    private readonly countryService: CountryService
  ) {}
  ngOnInit(): void {
    this.countryService.countryId$.subscribe((country) => {
      this.filter.countryId = country;
    });

    this.getExchanges();

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

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  private async getExchanges() {
    this.isLoadingResults = true;
    this.filter.userId = this.sessionService.getUserData().UserId;
    this.exchanges = await this.exchangeService.setExchangesFiltered(
      this.filter
    );
    this.filterExchanges = [...this.exchanges];
    this.dataSource.data = this.exchanges;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoadingResults = false;

    this.pharmacies = await this.pharmacyService.setPharmaciesBycountry(
      this.filter.countryId
    );
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
