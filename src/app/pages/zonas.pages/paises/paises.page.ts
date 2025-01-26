import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Pais } from 'src/app/interfaces/models';
import { DetallePais } from '../detalle-pais/detalle-pais';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.page.html',
  styleUrls: ['./paises.page.scss'],
})
export class PaisesPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de paises',
        isLink: false,
      },
    ],
  };

  @Input('ELEMENT_DATA') ELEMENT_DATA!: Pais[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort | null;
  displayedColumns: string[] = [
    'name',
    'currency',
    'phoneCode',
    'status',
    'acctions',
  ];
  dataSource = new MatTableDataSource<Pais>(this.ELEMENT_DATA);

  isLoadingResults: boolean = true;

  constructor(
    private readonly _liveAnnouncer: LiveAnnouncer,
    private readonly _dialog: MatDialog,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.sharedService.getCountryList();
    if (this.sharedService.getCountryList().length == 0) {
      this.getAllCountries();
    }
    this.isLoadingResults = false;
  }

  public async getAllCountries() {
    await this.sharedService.setCountry();
    this.dataSource.data = this.sharedService.getCountryList();
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
        title: id ? 'Editar País' : 'Agregar País',
        paisId: id,
      },
    };
    this._dialog
      .open(DetallePais, config)
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.isLoadingResults = true;
          this.getAllCountries();
          this.isLoadingResults = false;
        }
      });
  }

  chageState(row: Pais) {
    let msgDialog: string;
    if (row.isActive) {
      msgDialog = '¿Seguro de querer inhabilitar este país?';
    } else {
      msgDialog = '¿Seguro de querer habilitar este país?';
    }
    this._dialog
      .open(DialogConfComponent, {
        data: msgDialog,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.updateState(row);
        }
      });
  }

  public async updateState(row: Pais) {
    const country: any = {
      id: row.id,
      name: row.name,
      iso3: row.iso3,
      phoneCode: row.phoneCode,
      currency: row.currency,
      currencyName: row.currencyName,
      currencySymbol: row.currencySymbol,
      IsActive: !row.isActive,
    };
    try {
      this.isLoadingResults = true;
      this.apiService.put('Country', country);
      this.getAllCountries();
      this.sharedService.notify('País actualizado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando paises:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  generateReport() {
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        title: 'Reporte General de Paises',
        body: this.dataSource.data,
      },
    });
  }
}
