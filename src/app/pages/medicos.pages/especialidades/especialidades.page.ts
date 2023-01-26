import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';

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
    }, (err => {
      this.isLoadingResults = false
      console.log(err)
    }))
  }

  on(id?:string){
    const config = {
      data: {
        title: id ?'Editar especialidad' :'Agregar especialidad',
        especialId: id
      }
    }
    this._dialogo.open(DetalleEspacialidadPage, config)
    .afterClosed()
    .subscribe(() => {
      this.isLoadingResults = true
      this.cargarAll()
    })
  }
}
