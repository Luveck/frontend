import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Especialidad } from 'src/app/interfaces/models';
import { MedicosService } from 'src/app/services/medicos.service';

@Component({
  selector: 'app-detalle-espacialidad',
  templateUrl: './detalle-espacialidad.page.html',
  styleUrls: ['./detalle-espacialidad.page.scss']
})
export class DetalleEspacialidadPage implements OnInit {
  currentEspecialidad!: Especialidad | undefined;
  name!: string
  state: boolean = true
  isLoadingResults?:boolean

  constructor(
    private medicServ:MedicosService,
    public dialogo: MatDialogRef<DetalleEspacialidadPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data.especial){
      this.isLoadingResults = true
      const especial = this.medicServ.getEspecialidadById(this.data.especial)
      especial.subscribe(res => {
        console.log(res)
        this.currentEspecialidad = res
        this.isLoadingResults = false
        this.name = this.currentEspecialidad.name
        this.state = this.currentEspecialidad.isDeleted
      })
    }
  }

  save(){
    if(this.data.especial){
      let res = this.medicServ.updateEspecial(this.name, this.state, this.currentEspecialidad)
      res.subscribe(res => {
        if(res){
          this.medicServ.notify('Especialidad actualizada', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this.medicServ.notify('Ocurrio un error', 'error')
      }))
    }else{
      let res = this.medicServ.addEspecialidad(this.name)
      res.subscribe(res => {
        if(res){
          this.medicServ.notify('Espedialidad agregada', 'success')
          this.dialogo.close(true)
        }
      }, (err => {
        console.log(err)
        this.medicServ.notify('Ocurrio un error', 'error')
      }))
    }
  }
}
