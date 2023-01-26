import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Farmacia, Ciudad } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'

@Component({
  selector: 'app-detalle-farmacia',
  templateUrl: './detalle-farmacia.page.html',
  styleUrls: ['./detalle-farmacia.page.scss'],
})

export class DetalleFarmaciaPage implements OnInit {
  currentFarmacia!: Farmacia | undefined
  ciudades!: Ciudad[]
  ciudadTemp!: Ciudad
  isLoadingResults?:boolean

  public farmaForm = new FormGroup({
    name: new FormControl('', Validators.required),
    adress: new FormControl('', Validators.required),
    cityName: new FormControl(0, Validators.required),
  })

  constructor(
    private _zonasServ:ZonasService,
    public dialogo: MatDialogRef<DetalleFarmaciaPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(!this._zonasServ.listCiudades){
      const res = this._zonasServ.getCiudades()
      res.subscribe(res => this.ciudades = res)
    }else{
      this.ciudades = this._zonasServ.listCiudades
    }

    if(this.data.farmaId){
      this.isLoadingResults = true
      const pais = this._zonasServ.getFarmaciaById(this.data.farmaId)
      pais.subscribe(res => {
        this.currentFarmacia = res
        this.isLoadingResults = false
        this.initValores()
      }, (err => {
        this.isLoadingResults = false
        console.log(err)
      }))
    }
  }

  initValores(){
    this.farmaForm.patchValue({
      name: this.currentFarmacia!.name,
      adress: this.currentFarmacia!.adress,
      cityName: this.currentFarmacia!.cityId - 1
    })
  }

  resetForm(){
    this.farmaForm.reset()
  }

  save(){
    let citySelect = this.farmaForm.get('cityName')?.value!
    this.ciudadTemp = this.ciudades[citySelect]
    if(!this.data.farmaId){
      let peticion = this._zonasServ.addFarmacia(this.farmaForm.value, this.ciudadTemp)
      peticion.subscribe(res => {
        this._zonasServ.notify('Farmacia registrada', 'success')
        this.dialogo.close(true);
      }, (err => {
      console.log(err)
    }))
    }else{
      let peticion = this._zonasServ.updateFarmacia(this.farmaForm.value, this.currentFarmacia?.isDeleted, this.ciudadTemp, parseInt(this.data.farmaId))
       peticion.subscribe(res => {
        this._zonasServ.notify('Farmacia actualizada', 'success')
        this.dialogo.close(true);
      }, (err => {
      console.log(err)
    }))
    }
  }
}
