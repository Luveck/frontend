import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Farmacia } from 'src/app/interfaces/models';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { DetalleFarmacia } from '../detalle-farmacia/detalle-farmacia';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

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

  constructor(
    private readonly _liveAnnouncer: LiveAnnouncer,
    private readonly _dialog: MatDialog,
    private readonly farmaServ: FarmaciasService,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getPharmacies();
  }

  private async getPharmacies() {
    await this.farmaServ.setPharmacies();
    this.dataSource.data = this.farmaServ.getPharmacies();
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
    pharmacy = this.sharedService.addIpDevice(pharmacy);
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
