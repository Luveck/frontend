import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements AfterViewInit {
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
    'country',
    'namePharmacy',
    'reviewed',
    'creationDate',
    'acctions',
  ];
  dataSource = new MatTableDataSource<Venta>(this.ELEMENT_DATA);

  isLoadingResults: boolean = true;
  public filter: FilterPurchase = {} as FilterPurchase;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dataServ: DataService,
    private _dialog: MatDialog,

    private readonly ventasService: VentasService,
    private readonly sharedService: SharedService,
    private readonly sessionService: SessionService
  ) {
    this.filter.pharmacyId = sessionService.getUserData().pharmacyId;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getPurchases();
  }

  private async getPurchases() {
    await this.ventasService.setProductsPurchasesFiltered(this.filter);
    this.isLoadingResults = false;
    this.dataSource.data = this.ventasService.getPurchases();
    this.dataSource.data = this.dataSource.data.sort((a) => {
      if (a.reviewed) return 0;
      else return 1;
    });
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

  chageState(row: Venta) {
    const formData = {
      pharmacyId: row.idPharmacy,
      userId: row.userId,
      noPurchase: row.noPurchase,
    };
    let msgDialog: string;
    if (!row.reviewed) {
      msgDialog = '¿Seguro de querer verificar esta venta?';
    } else {
      msgDialog = '¿Seguro de querer invalidar esta venta?';
    }
    this._dialog
      .open(DialogConfComponent, {
        data: msgDialog,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          // row.reviewed = !row.reviewed
          // const res = this._ventasServ.checkVenta(formData, row.id, row.reviewed)
          //   res?.subscribe(res => {
          //     if(res){
          //       this._ventasServ.notify('Venta validada', 'success')
          //       this.isLoadingResults = true
          //       this.getAllVentas()
          //     }
          //   }, (err => {
          //     console.log(err)
          //     this._ventasServ.notify('Ocurrio un error con el proceso.', 'error')
          //   }))
        }
      });
  }

  generateReport() {
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        title: 'Reporte General de Ventas',
        body: this.dataSource.data,
      },
    });
  }
}
