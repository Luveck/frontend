import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Ciudad, Departamento } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'

@Component({
  selector: 'app-detalle-ciudad',
  templateUrl: './detalle-ciudad.html',
  styleUrls: ['./detalle-ciudad.scss'],
})

export class DetalleCiudad implements OnInit {
  currentCiudad!: Ciudad | any
  departamentos!: Departamento[]
  isLoadingResults!:boolean

  public ciudadForm = new FormGroup({
    departymentId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  })

  constructor(
    private _zonasServ:ZonasService,
    public dialogo: MatDialogRef<DetalleCiudad>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.ciudadId){
      this.isLoadingResults = true
      const ciudad = this._zonasServ.getCiudadById(this.data.ciudadId)
      ciudad?.subscribe(res => {
        console.log(res)
        this.currentCiudad = res.result
        this.isLoadingResults = false
        this.initValores()
      }, (err => {
        console.log(err)
        this.isLoadingResults = false
        this._zonasServ.notify('Ocurrio un error con la petición', 'error')
      }))
    }
    this.departamentos = this._zonasServ.listDepartamentos
  }

  initValores(){
    this.ciudadForm.patchValue({
      departymentId: this.currentCiudad.departymentId,
      name: this.currentCiudad.name,
    })
  }

  resetForm(){
    this.ciudadForm.reset()
  }

  save(){
    if(this.data.ciudadId){
      const peticion = this._zonasServ.updateCiudad(this.ciudadForm.value, this.data.ciudadId, this.currentCiudad.state)
      peticion?.subscribe(() => {
        this._zonasServ.notify('Registro actualizado', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._zonasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }else{
      const peticion = this._zonasServ.addCiudad(this.ciudadForm.value)
      peticion?.subscribe(() => {
        this._zonasServ.notify('Ciudad registrada', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._zonasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }
  }
}
