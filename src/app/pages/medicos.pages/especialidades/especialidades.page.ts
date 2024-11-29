import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

import { MedicosService } from 'src/app/services/medicos.service';
import { DetalleEspacialidad } from '../detalle-especialidad/detalle-espacialidad';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Especialidad } from 'src/app/interfaces/models';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.page.html',
  styleUrls: ['./especialidades.page.scss'],
})

export class EspecialidadesPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de especialidades',
        isLink: false,
      }
    ]
  }

  isLoadingResults:boolean = true;
  filteredEspecialidad: Especialidad[] = [];
  public specialtyList: any[] = [];


  constructor(
    private _dialog:MatDialog,
    public medicServ:MedicosService,
    public sharedService: SharedService,
    public apiService: ApiService
  ){}

  ngOnInit(): void {
    this.getSpecialties()
  }

  public async getSpecialties(){
    try {
      this.isLoadingResults = true;
      await this.medicServ.setSpecialties();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso.', 'error');
    } finally {
      this.isLoadingResults = false;
      this.filteredEspecialidad = this.medicServ.getSpecialties();
      this.specialtyList = this.medicServ.getSpecialties();
    }
  }

  on(id?:number){
    const config = {
      data: {
        title: id ?'Editar especialidad' :'Agregar especialidad',
        especialId: id
      }
    }
    this._dialog.open(DetalleEspacialidad, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getSpecialties()
      }
    })
  }

  chageState(row:Especialidad){
    let msgDialog:string
    if(row.isActive){
      msgDialog = '¿Seguro de querer inhabilitar esta Especialidad?'
    }else{
      msgDialog = '¿Seguro de querer habilitar esta Especialidad?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        const specialty = {
          id: row.id,
          name: row.name,
          isActive:!row.isActive,
          Ip: this.sharedService.userIP,
          Device: this.sharedService.userDevice,
        }
        this.updateStatus(specialty);
      }
    })
  }
  public async updateStatus(specialty: any) {
    try {
      this.isLoadingResults = true;
      await this.apiService.put('Discipline', specialty);
      this.sharedService.notify('Especialidad actualizada', 'success');
      this.getSpecialties();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso.', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }
  generateReport(){
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Especialidades Médicas',
        'body': this.specialtyList
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();

    this.specialtyList= this.filteredEspecialidad.filter(x =>
      x.name.toLowerCase().includes(filterValue)
    );
  }
}
