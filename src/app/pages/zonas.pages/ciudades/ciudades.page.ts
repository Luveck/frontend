import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ciudad } from 'src/app/interfaces/models';
import { DetalleCiudad } from '../detalle-ciudad/detalle-ciudad';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-ciudades',
  templateUrl: './ciudades.page.html',
  styleUrls: ['./ciudades.page.scss'],
})
export class CiudadesPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de ciudades',
        isLink: false,
      },
    ],
  };

  @Input('ELEMENT_DATA') ELEMENT_DATA!: Ciudad[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort | null;
  displayedColumns: string[] = [
    'name',
    'departmentName',
    'countryName',
    'state',
    'acctions',
  ];
  dataSource = new MatTableDataSource<Ciudad>(this.ELEMENT_DATA);

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
    this.dataSource.data = this.sharedService.getCityList();
    if (this.sharedService.getCityList().length == 0) {
      this.getCitites();
    }
    this.isLoadingResults = false;
  }

  public async getCitites() {
    await this.sharedService.setCities();
    this.dataSource.data = this.sharedService.getCityList();
    this.isLoadingResults = false;
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
        title: id ? 'Editar Ciudad' : 'Agregar Ciudad',
        ciudadId: id,
      },
    };
    this._dialog
      .open(DetalleCiudad, config)
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.isLoadingResults = true;
          this.getCitites();
        }
      });
  }

  chageState(row: Ciudad) {
    const city = {
      id: row.id,
      name: row.name,
      isActive: !row.isActive,
      departmentId: row.departmentId,
    };
    let msgDialog: string;
    if (row.isActive) {
      msgDialog = '¿Seguro de querer inhabilitar esta ciudad?';
    } else {
      msgDialog = '¿Seguro de querer habilitar esta ciudad?';
    }
    this._dialog
      .open(DialogConfComponent, {
        data: msgDialog,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.updateCity(city);
        }
      });
  }

  generateReport() {
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        title: 'Reporte General de Ciudades',
        body: this.dataSource.data,
      },
    });
  }

  public async updateCity(city: any) {
    try {
      await this.apiService.put('City', city);
      this.getCitites();
      this.sharedService.notify('Ciudad actualizada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando ciudades:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }
}
