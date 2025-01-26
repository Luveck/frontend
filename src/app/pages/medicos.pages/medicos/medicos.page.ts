import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Medico } from 'src/app/interfaces/models';
import { MedicosService } from 'src/app/services/medicos.service';
import { DetalleMedico } from '../detalle-medico/detalle-medico';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.page.html',
  styleUrls: ['./medicos.page.scss'],
})
export class MedicosPage implements AfterViewInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de Médicos',
        isLink: false,
      },
    ],
  };

  @Input('ELEMENT_DATA') ELEMENT_DATA!: Medico[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort | null;
  displayedColumns: string[] = [
    'name',
    'patologyName',
    'isDeleted',
    'acctions',
  ];
  dataSource = new MatTableDataSource<Medico>(this.ELEMENT_DATA);

  isLoadingResults: boolean = true;

  constructor(
    private readonly _liveAnnouncer: LiveAnnouncer,
    private readonly _dialog: MatDialog,
    public medicServ: MedicosService,
    private readonly apiService: ApiService,
    private readonly sharedservice: SharedService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getMedicals();
  }

  private async getMedicals() {
    await this.medicServ.setMedicos();
    this.dataSource.data = this.medicServ.getMedicos();
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
        title: id ? 'Editar Médico' : 'Agregar Médico',
        medicoId: id,
      },
    };
    this._dialog
      .open(DetalleMedico, config)
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.isLoadingResults = true;
          this.getMedicals();
        }
      });
  }

  private async updateMedical(medical: any) {
    try {
      await this.apiService.put(`Medical`, medical);
      this.sharedservice.notify('Médico actualizado', 'success');
    } catch (error) {
      this.sharedservice.notify(
        this.errorHandlerService.handleError(error, 'Actualizando medicos:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }
  chageState(row: any) {
    let medical = {
      id: row.id,
      isActive: !row.isActive,
      name: row.name,
      disciplineId: row.disciplineId,
      register: row.register,
      countryId: '1',
    };
    let msgDialog: string;
    if (row.isActive) {
      msgDialog = '¿Seguro de querer inhabilitar el registro de este médico?';
    } else {
      msgDialog = '¿Seguro de querer habilitar el registro de este médico?';
    }
    this._dialog
      .open(DialogConfComponent, {
        data: msgDialog,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        this.updateMedical(medical);
      });
  }

  generateReport() {
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        title: 'Reporte General de Médicos',
        body: this.dataSource.data,
      },
    });
  }
}
