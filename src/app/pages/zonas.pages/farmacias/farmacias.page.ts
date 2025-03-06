import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Ciudad, Departamento, Farmacia } from 'src/app/interfaces/models';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { DetalleFarmacia } from '../detalle-farmacia/detalle-farmacia';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-farmacias',
  templateUrl: './farmacias.page.html',
  styleUrls: ['./farmacias.page.scss'],
})
export class FarmaciasPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de Farmacias',
        isLink: false,
      },
    ],
  };

  @Input('ELEMENT_DATA') ELEMENT_DATA!: Farmacia[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort | null;
  displayedColumns: string[] = [
    'name',
    'city',
    'chain',
    'isDeleted',
    'acctions',
  ];
  dataSource = new MatTableDataSource<Farmacia>(this.ELEMENT_DATA);

  isLoadingResults: boolean = true;
  private countryId = '';
  departamentos!: Departamento[];
  filteredDepartments: Departamento[] = [];
  ciudades!: Ciudad[];
  filteredCities: Ciudad[] = [];
  public pharmacies: any[] = [];
  public filteredPharmacies: any[] = [];

  constructor(
    private readonly _liveAnnouncer: LiveAnnouncer,
    private readonly _dialog: MatDialog,
    private readonly farmaServ: FarmaciasService,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly countryService: CountryService
  ) {}
  ngOnInit(): void {
    this.getConfigurations().then(() => {
      this.countryService.countryId$.subscribe((country) => {
        this.countryId = country;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getPharmacies();
        this.getDepartments();
      });
    });
  }

  private async getConfigurations() {
    this.departamentos = await this.sharedService.setDepartments();
    this.filteredDepartments = [...this.departamentos];
    this.ciudades = await this.sharedService.setCities();
    this.filteredCities = [...this.ciudades];
  }
  private async getPharmacies() {
    await this.farmaServ.setPharmaciesBycountry(this.countryId);
    this.pharmacies = this.farmaServ.getPharmacies();
    this.filteredPharmacies = [...this.pharmacies];
    this.dataSource.data = this.pharmacies;
    this.isLoadingResults = false;
  }

  private getDepartments() {
    this.departamentos = this.filteredDepartments.filter(
      (dept) => dept.countryId === Number(this.countryId)
    );
    this.getCites();
  }

  private getCites() {
    const cities = this.sharedService.getCityList();
    this.ciudades = cities.filter(
      (cities) => cities.department.countryId === Number(this.countryId)
    );
  }

  public filterByDepartment(event: Event) {
    const cities = this.sharedService.getCityList();
    this.ciudades = cities.filter(
      (city) => city.departmentId === Number(event) && city.isActive
    );

    this.pharmacies = this.filteredPharmacies.filter(
      (pharmacy) => pharmacy.city.departmentId === Number(event)
    );

    this.dataSource.data = this.pharmacies;
  }

  public filterByCity(event: Event) {
    this.pharmacies = this.filteredPharmacies.filter(
      (pharmacy) => pharmacy.cityId === Number(event)
    );

    this.dataSource.data = this.pharmacies;
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

  on(id?: string) {
    const config = {
      data: {
        title: id ? 'Editar Farmacia' : 'Agregar Farmacia',
        farmaId: id,
      },
    };
    this._dialog
      .open(DetalleFarmacia, config)
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.isLoadingResults = true;
          this.getPharmacies();
        }
      });
  }

  chageState(row: any) {
    let pharmacy = {
      id: row.id,
      name: row.name,
      adress: row.adress,
      isActive: !row.isActive,
      cityId: row.cityId,
      chainId: row.chainId,
    };
    let msgDialog: string;
    if (row.isActive) {
      msgDialog = '¿Seguro de querer inhabilitar esta farmacia?';
    } else {
      msgDialog = '¿Seguro de querer habilitar esta farmacia?';
    }
    this._dialog
      .open(DialogConfComponent, {
        data: msgDialog,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.updatePharmacy(pharmacy);
        }
      });
  }

  private async updatePharmacy(pharmacy: any) {
    try {
      this.isLoadingResults = true;
      await this.apiService.put('Pharmacy', pharmacy);
      this.sharedService.notify('Farmacia actualizada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando farmacia:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
      this.getPharmacies();
    }
  }

  generateReport() {
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        title: 'Reporte General de Farmacias',
        body: this.dataSource.data,
      },
    });
  }
}
