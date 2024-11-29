import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MedicosService } from 'src/app/services/medicos.service';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Patology } from 'src/app/interfaces/models';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';
import { DetallePatologia } from '../detalle-patologia/detalle-patologia';

@Component({
  selector: 'app-patologia',
  templateUrl: './patologia.page.html',
  styleUrls: ['./patologia.page.scss'],
})
export class PatologiaPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de Patologías',
        isLink: false,
      },
    ],
  };
  public patologyList: any[] = [];
  isLoadingResults: boolean = true;

  constructor(
    private _dialog: MatDialog,
    public medicServ: MedicosService,
    public sharedService: SharedService,
    public apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getPatologies();
    this.isLoadingResults = false;
  }

  public async getPatologies() {
    try {
      this.isLoadingResults = true;
      await this.medicServ.setPatology();
      this.patologyList = this.medicServ.getPatology();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso.', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }

  on(id?: number) {
    const config = {
      data: {
        title: id ? 'Editar Patología' : 'Agregar Patología',
        especialId: id,
      },
    };
    this._dialog
      .open(DetallePatologia, config)
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.isLoadingResults = true;
          this.getPatologies();
        }
      });
  }

  chageState(row: Patology) {
    let msgDialog: string;
    if (row.isActive) {
      msgDialog = '¿Seguro de querer inhabilitar esta Patología?';
    } else {
      msgDialog = '¿Seguro de querer habilitar esta Patología?';
    }
    this._dialog
      .open(DialogConfComponent, {
        data: msgDialog,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          let patology = {
            id: row.id,
            name: row.name,
            isActive: !row.isActive,
            Ip: this.sharedService.userIP,
            Device: this.sharedService.userDevice,
          };
          this.updatePatology(patology);
        }
      });
  }

  generateReport() {
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        title: 'Reporte General de Patologías Médicas',
        body: this.medicServ.getPatology(),
      },
    });
  }

  public async updatePatology(patology: any) {
    try {
      this.isLoadingResults = true;
      await this.apiService.put('Patology', patology);
      this.sharedService.notify('Patología actualizada', 'success');
      this.getPatologies();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso.', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }
}
