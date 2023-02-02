import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

import { MedicosService } from 'src/app/services/medicos.service';
import { DetalleEspacialidad } from '../detalle-especialidad/detalle-espacialidad';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Especialidad } from 'src/app/interfaces/models';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';

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

  constructor(
    private _dialog:MatDialog,
    public medicServ:MedicosService
  ){}

  ngOnInit(): void {
    this.getAllEspecials()
  }

  getAllEspecials(){
    const catsAll = this.medicServ.getEspecialidades()
    catsAll.subscribe(res => {
      this.isLoadingResults = false
      this.medicServ.especialidades = res.result
      console.log(this.medicServ.especialidades)
    }, (err => {
      this.isLoadingResults = false
      console.log(err)
    }))
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
        this.getAllEspecials()
      }
    })
  }

  chageState(row:Especialidad){
    let msgDialog:string
    if(!row.isDeleted){
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
        row.isDeleted = !row.isDeleted
        const res = this.medicServ.updateEspecial(row.name, row.id, row.isDeleted)
          res.subscribe(res => {
            if(res){
              this.medicServ.notify('Especilidad actualizada', 'success')
              this.isLoadingResults = true
              this.getAllEspecials()
            }
          }, (err => {
            console.log(err)
            this.getAllEspecials()
            this.medicServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  generateReport(){
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Especialidades Médicas',
        'body': this.medicServ.especialidades
      }
    })
  }
}
