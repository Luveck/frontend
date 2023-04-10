import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Departamento, Pais } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'

@Component({
  selector: 'app-detalle-departamento',
  templateUrl: './detalle-departamento.html',
  styleUrls: ['./detalle-departamento.scss'],
})

export class Detalledepartamento implements OnInit {
  currentDepartamento!: Departamento | any
  paises!: Pais[]
  isLoadingResults!:boolean

  public departamentoForm = new FormGroup({
    idCountry: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
  })

  constructor(
    private _zonasServ:ZonasService,
    public dialogo: MatDialogRef<Detalledepartamento>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.departamentoId){
      this.isLoadingResults = true
      const departamento = this._zonasServ.getDepartamentoById(this.data.departamentoId)
      departamento?.subscribe(res => {
        console.log(res)
        this.currentDepartamento = res.result
        this.isLoadingResults = false
        this.initValores()
      }, (err => {
        console.log(err)
        this.isLoadingResults = false
        this._zonasServ.notify('Ocurrio un error con la petición', 'error')
      }))
    }
    this.paises = this._zonasServ.listPaises
  }

  initValores(){
    this.departamentoForm.patchValue({
      idCountry: this.currentDepartamento.countryId,
      name: this.currentDepartamento.name,
    })
  }

  resetForm(){
    this.departamentoForm.reset()
  }

  save(){
    if(this.data.departamentoId){
      const peticion = this._zonasServ.updateDepartamento(this.departamentoForm.value, this.data.departamentoId, this.currentDepartamento.status)
      peticion?.subscribe(() => {
        this._zonasServ.notify('Registro actualizado', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._zonasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }else{
      const peticion = this._zonasServ.addDepartamento(this.departamentoForm.value)
      peticion?.subscribe(() => {
        this._zonasServ.notify('Departamento registrado', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._zonasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }
  }
}
