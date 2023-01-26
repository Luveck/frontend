import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Especialidad } from 'src/app/interfaces/models';
import { MedicosService } from 'src/app/services/medicos.service';

@Component({
  selector: 'app-detalle-espacialidad',
  templateUrl: './detalle-espacialidad.page.html',
  styleUrls: ['./detalle-espacialidad.page.scss']
})
export class DetalleEspacialidadPage implements OnInit {
  currentEspecialidad!: Especialidad | any;
  name!: string
  state!: boolean
  isLoadingResults?:boolean

  constructor(
    private medicServ:MedicosService,
    private _dialogo:MatDialog,
    public dialogo: MatDialogRef<DetalleEspacialidadPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if(this.data.especialId){
      this.isLoadingResults = true
      const especial = this.medicServ.getEspecialidadById(this.data.especialId)
      especial.subscribe(res => {
        console.log(res)
        this.currentEspecialidad = res.result
        this.isLoadingResults = false
        this.name = this.currentEspecialidad.name
        this.state = this.currentEspecialidad.isDeleted
      },(err => {
        this.isLoadingResults = false
        console.log(err)
      }))
    }
  }

  save(){
    if(this.data.especialId){
      let res = this.medicServ.updateEspecial(this.name, this.state, this.data.especialId)
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

  chageState(state:boolean){
    let msgDialog:string
    if(!state){
      msgDialog = '¿Seguro de querer inhabilitar esta especialidad?'
    }else{
      msgDialog = '¿Seguro de querer habilitar esta especialidad?'
    }
    this._dialogo.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        this.state = !this.state
        let res = this.medicServ.updateEspecial(this.name, this.state, this.data.especialId)
          res.subscribe(res => {
            if(res){
              this.medicServ.notify('Especialidad actualizada', 'success')
              this.currentEspecialidad.isDeleted = !state
            }
          }, (err => {
            console.log(err)
            this.medicServ.notify('Ocurrio un error', 'error')
          }))
      }
    })
  }
}
