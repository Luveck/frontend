import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Especialidad } from 'src/app/interfaces/models';
import { MedicosService } from 'src/app/services/medicos.service';

@Component({
  selector: 'app-detalle-espacialidad',
  templateUrl: './detalle-espacialidad.html',
  styleUrls: ['./detalle-espacialidad.scss']
})

export class DetalleEspacialidad implements OnInit {
  currentEspecialidad!: Especialidad | any;
  name!: string
  isLoadingResults!:boolean

  constructor(
    private _medicServ:MedicosService,
    public dialogo: MatDialogRef<DetalleEspacialidad>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data.especialId){
      this.isLoadingResults = true
      const especial = this._medicServ.getEspecialidadById(this.data.especialId)
      especial.subscribe(res => {
        console.log(res)
        this.currentEspecialidad = res.result
        this.isLoadingResults = false
        this.name = this.currentEspecialidad.name
      },(err => {
        console.log(err)
        this.isLoadingResults = false
        this._medicServ.notify('Ocurrio un error', 'error')
      }))
    }
  }

  save(){
    if(this.data.especialId){
      const peticion = this._medicServ.updateEspecial(this.name, this.data.especialId, this.currentEspecialidad.isDeleted)
      peticion.subscribe(res => {
        if(res){
          this._medicServ.notify('Especialidad actualizada', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this._medicServ.notify('Ocurrio un error', 'error')
      }))
    }else{
      const peticion = this._medicServ.addEspecialidad(this.name)
      peticion.subscribe(res => {
        if(res){
          this._medicServ.notify('Espedialidad registrada', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this._medicServ.notify('Ocurrio un error', 'error')
      }))
    }
  }
}
