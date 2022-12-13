import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Especialidad } from 'src/app/interfaces/models';
import { MedicosService } from 'src/app/services/medicos.service';
import { DetalleEspacialidadPage } from '../detalle-especialidad/detalle-espacialidad.page';


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
        link: '/'
      },
      {
        name: 'Gestión de especialidades',
        isLink: false,
      }
    ]
  }

  isLoadingResults:boolean = true;

  constructor(
    private _dialogo:MatDialog,
    public medicServ:MedicosService
  ){}

  ngOnInit(): void {
    this.cargarAll()
  }

  cargarAll(){
    let catsAll = this.medicServ.getAllEspecialidades()
    catsAll.subscribe(res => {
      this.isLoadingResults = false
      this.medicServ.especialidades = res.result
      console.log(this.medicServ.especialidades)
    }, (err => console.log(err)))
  }

  on(id?:string){
    const config = {
      data: {
        title: id ?'Editar especialidad' :'Agregar especialidad',
        especial: id
      }
    }
    this._dialogo.open(DetalleEspacialidadPage, config)
    .afterClosed()
    .subscribe((confirmado:boolean) => {
      if(confirmado){
        this.isLoadingResults = true
        this.cargarAll()
      }
    })
  }

  delete(especial:Especialidad){
    if(!especial.isDeleted){
      this._dialogo.open(DialogConfComponent, {
        data: `¿Seguro de querer inhabilitar esta especialidad?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          const res = this.medicServ.deleteEspecialidad(especial.id!)
          res.subscribe(res => {
            if(res){
              this.medicServ.notify('especialidad eliminada', 'success')
              this.isLoadingResults = true
              this.cargarAll()
            }
          }, (err => {
            console.log(err)
            this.medicServ.notify('Ocurrio un error', 'error')
          }))
        }
      })
    }else{
      this._dialogo.open(DialogConfComponent, {
        data: `¿Seguro de querer habilitar esta especialidad?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          const res = this.medicServ.changeStateEspecialidad(false, especial)
          res.subscribe(res => {
            if(res){
              this.medicServ.notify('especialidad restaurada', 'success')
              this.isLoadingResults = true
              this.cargarAll()
            }
          }, (err => {
            console.log(err)
            this.medicServ.notify('Ocurrio un error', 'error')
          }))
        }
      })
    }
  }
}
