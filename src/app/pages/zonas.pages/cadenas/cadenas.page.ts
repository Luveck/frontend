import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cadena } from 'src/app/interfaces/models';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { DetalleCadena } from '../detalle-cadena/detalle-cadena';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cadenas',
  templateUrl: './cadenas.page.html',
  styleUrls: ['./cadenas.page.scss'],
})
export class CadenasPage implements AfterViewInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de Cadenas',
        isLink: false,
      },
    ],
  };

  @Input('ELEMENT_DATA') ELEMENT_DATA!: Cadena[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort | null;
  displayedColumns: string[] = ['name', 'isDeleted', 'acctions'];
  dataSource = new MatTableDataSource<Cadena>(this.ELEMENT_DATA);

  isLoadingResults: boolean = true;

  constructor(
    private readonly _liveAnnouncer: LiveAnnouncer,
    private readonly _dialog: MatDialog,
    private readonly chainService: FarmaciasService,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getChains();
  }

  public async getChains() {
    await this.chainService.setChain();
    this.isLoadingResults = false;
    this.dataSource.data = this.chainService.getChainList();
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
        title: id ? 'Editar Cadena' : 'Agregar Cadena',
        id: id,
      },
    };
    this._dialog
      .open(DetalleCadena, config)
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.isLoadingResults = true;
          this.getChains();
        }
      });
  }

  chageState(row: any) {
    const chain = {
      name: row.name,
      isActive: !row.isActive,
      id: row.id,
    };
    let msgDialog: string;
    if (row.isActive) {
      msgDialog = '¿Seguro de querer inhabilitar esta cadena?';
    } else {
      msgDialog = '¿Seguro de querer habilitar esta cadena?';
    }
    this._dialog
      .open(DialogConfComponent, {
        data: msgDialog,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.isLoadingResults = true;
          this.updateChain(chain);
        }
      });
  }
  private async updateChain(chain: any) {
    try {
      await this.apiService.put(`Chain`, chain);
      this.sharedService.notify('Cadena actualizada', 'success');
      this.getChains();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso.', 'error');
    } finally {
      this.isLoadingResults = true;
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
