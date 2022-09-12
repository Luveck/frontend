import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Especialidad, Medico } from 'src/app/interfaces/models'
import { MedicosService } from 'src/app/services/medicos.service'

@Component({
  selector: 'app-detalle-medico',
  templateUrl: './detalle-medico.page.html',
  styleUrls: ['./detalle-medico.page.scss'],
})

export class DetalleMedicoPage implements OnInit {
  currentMedic!: Medico | undefined
  especialidades!: Especialidad[]
  especialidadTemp!: Especialidad
  isLoadingResults?:boolean

  public medicForm = new FormGroup({
    name: new FormControl('', Validators.required),
    register: new FormControl('', Validators.required),
    patologyName: new FormControl(0, Validators.required)
  })

  constructor(
    private _medicServ: MedicosService,
    public dialogo: MatDialogRef<DetalleMedicoPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(!this._medicServ.especialidades){
      const res = this._medicServ.getAllEspecialidades()
      res.subscribe(res => this.especialidades = res)
    }else{
      this.especialidades = this._medicServ.especialidades
    }

    if(this.data.medicoId){
      this.isLoadingResults = true
      const pais = this._medicServ.getMedicoById(this.data.medicoId)
      pais.subscribe(res => {
        this.currentMedic = res
        this.isLoadingResults = false
        this.initValores()
      }, (err => console.log(err)))
    }
  }

  initValores(){
    console.log(this.currentMedic)
    this.medicForm.patchValue({
      name: this.currentMedic!.name,
      register: this.currentMedic!.register,
      patologyName: this.currentMedic!.patologyId - 1
    })
  }

  resetForm(){
    this.medicForm.reset()
  }

  save(){
    let especialSelect = this.medicForm.get('patologyName')?.value!
    this.especialidadTemp = this.especialidades[especialSelect]
    if(!this.data.medicoId){
      let peticion = this._medicServ.addMedico(this.medicForm.value, this.especialidadTemp)
      peticion.subscribe(res => {
        this._medicServ.notify('Medico registrado', 'success')
        this.dialogo.close(true);
      }, err => console.log(err))
    }else{
      let peticion = this._medicServ.updateMedico(this.medicForm.value, this.currentMedic?.isDeleted, this.especialidadTemp, parseInt(this.data.medicoId))
       peticion.subscribe(res => {
        this._medicServ.notify('Medico actualizado', 'success')
        this.dialogo.close(true);
      }, err => console.log(err))
    }
  }
}
