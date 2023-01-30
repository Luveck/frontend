import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Pais } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'

@Component({
  selector: 'app-detalle-pais',
  templateUrl: './detalle-pais.page.html',
  styleUrls: ['./detalle-pais.page.scss'],
})

export class DetallePaisPage implements OnInit {
  currentPais!: Pais | any
  isLoadingResults!:boolean
  urlFlag!:string

  public paisForm = new FormGroup({
    name: new FormControl('', Validators.required),
    iso3: new FormControl('', Validators.required),
    phoneCode: new FormControl('', Validators.required),
    currency: new FormControl('', Validators.required),
    currencyName: new FormControl('', Validators.required),
    currencySymbol: new FormControl('', Validators.required)
  })

  constructor(
    private _zonasServ:ZonasService,
    public dialogo: MatDialogRef<DetallePaisPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.paisId){
      this.isLoadingResults = true
      const pais = this._zonasServ.getPaisById(this.data.paisId)
      pais.subscribe(res => {
        console.log(res)
        this.currentPais = res.result
        this.isLoadingResults = false
        this.initValores()
      }, (err => {
        this.isLoadingResults = false
        console.log(err)
        this._zonasServ.notify('Ocurrio un error con la petición', 'error')
      }))
    }
  }

  initValores(){
    this.urlFlag = `https://flagcdn.com/${this.currentPais.iso3.toLowerCase()}.svg`
    this.paisForm.patchValue({
      name: this.currentPais.name,
      iso3: this.currentPais.iso3,
      phoneCode: this.currentPais.phoneCode,
      currency: this.currentPais.currency,
      currencyName: this.currentPais.currencyName,
      currencySymbol: this.currentPais.currencySymbol
    })
  }

  resetForm(){
    this.paisForm.reset()
  }

  save(){
    if(this.data.paisId){
      let peticion = this._zonasServ.updatePais(this.paisForm.value, this.data.paisId, this.currentPais?.status)
      peticion.subscribe(res => {
        this._zonasServ.notify('Registro actualizado', 'success')
        this.dialogo.close(true)
      }, err => {
        console.log(err)
        this._zonasServ.notify('Ocurrio un error con el proceso.', 'error')
      })
    }else{
      const peticion = this._zonasServ.addPais(this.paisForm.value)
      peticion.subscribe(res => {
        this._zonasServ.notify('País registrado', 'success')
        this.dialogo.close(true)
      }, err => {
        console.log(err)
        this._zonasServ.notify('Ocurrio un error con el proceso.', 'error')
      })
    }
  }
}
