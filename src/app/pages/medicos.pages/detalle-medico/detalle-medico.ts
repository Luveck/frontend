import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Especialidad, Medico } from 'src/app/interfaces/models'
import { MedicosService } from 'src/app/services/medicos.service'

@Component({
  selector: 'app-detalle-medico',
  templateUrl: './detalle-medico.html',
  styleUrls: ['./detalle-medico.scss'],
})

export class DetalleMedico implements OnInit {
  currentMedic!: Medico | any
  especialidades!: Especialidad[]
  isLoadingResults!:boolean

  public medicForm = new FormGroup({
    name: new FormControl('', Validators.required),
    register: new FormControl('', Validators.required),
    patologyId: new FormControl('', Validators.required)
  })

  constructor(
    private _medicServ: MedicosService,
    public dialogo: MatDialogRef<DetalleMedico>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(!this._medicServ.especialidades){
      const res = this._medicServ.getEspecialidades()
      res.subscribe(res => this.especialidades = res.result)
    }else{
      this.especialidades = this._medicServ.especialidades
    }

    if(this.data.medicoId){
      this.isLoadingResults = true
      const pais = this._medicServ.getMedicoById(this.data.medicoId)
      pais.subscribe(res => {
        console.log(res)
        this.currentMedic = res
        this.isLoadingResults = false
        this.initValores()
      }, (err => {
        console.log(err)
        this.isLoadingResults = false
        this._medicServ.notify('Ocurrio un error con la petición', 'error')
      }))
    }
  }

  initValores(){
    this.medicForm.patchValue({
      name: this.currentMedic.name,
      register: this.currentMedic.register,
      patologyId: this.currentMedic.patologyId
    })
  }

  resetForm(){
    this.medicForm.reset()
  }

  save(){
    if(this.data.medicoId){
      const peticion = this._medicServ.updateMedico(this.medicForm.value, this.data.medicoId, this.currentMedic.isDeleted)
       peticion.subscribe(() => {
        this._medicServ.notify('Medico actualizado', 'success')
        this.dialogo.close(true);
      }, err => {
        console.log(err)
        this._medicServ.notify('Ocurrio un error con el proceso', 'error')
      })
    }else{
      const peticion = this._medicServ.addMedico(this.medicForm.value)
      peticion.subscribe(() => {
        this._medicServ.notify('Medico registrado', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._medicServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }
  }
}
