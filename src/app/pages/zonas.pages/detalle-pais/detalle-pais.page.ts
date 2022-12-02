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
  currentPais!: Pais | undefined
  isLoadingResults?:boolean

  public newPaisForm = new FormGroup({
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
        this.currentPais = res
        this.isLoadingResults = false
        this.initValores()
      }, (err => console.log(err)))
    }
  }

  initValores(){
    this.newPaisForm.patchValue({
      name: this.currentPais!.name,
      iso3: this.currentPais!.iso3,
      phoneCode: this.currentPais!.phoneCode,
      currency: this.currentPais!.currency,
      currencyName: this.currentPais!.currencyName,
      currencySymbol: this.currentPais!.currencySymbol
    })
  }

  resetForm(){
    this.newPaisForm.reset()
  }

  addEditPais(){
    if(!this.data.paisId){
      let peticion = this._zonasServ.addPais(this.newPaisForm.value)
      peticion.subscribe(res => {
        this._zonasServ.notify('País registrado', 'success')
        this.dialogo.close(true);
      }, err => console.log(err))
    }else{
      let peticion = this._zonasServ.addOrUpdatePais(this.newPaisForm.value, this.data.paisId, this.currentPais!.status)
      peticion.subscribe(res => {
        this._zonasServ.notify('Registro actualizado', 'success')
        this.dialogo.close(true);
      }, err => console.log(err))
    }
  }
}
