import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Farmacia, Ciudad } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'
import { FarmaciasService } from 'src/app/services/farmacias.service';

@Component({
  selector: 'app-detalle-farmacia',
  templateUrl: './detalle-farmacia.html',
  styleUrls: ['./detalle-farmacia.scss'],
})

export class DetalleFarmacia implements OnInit {
  currentFarmacia!: Farmacia | any
  ciudades!: Ciudad[]
  isLoadingResults!:boolean

  public farmaForm = new FormGroup({
    name: new FormControl('', Validators.required),
    adress: new FormControl('', Validators.required),
    cityId: new FormControl('', Validators.required)
  })

  constructor(
    private _zonasServ:ZonasService,
    private _farmaServ:FarmaciasService,
    public dialogo: MatDialogRef<DetalleFarmacia>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.farmaId){
      this.isLoadingResults = true
      const farmacia = this._farmaServ.getFarmaciaById(this.data.farmaId)
      farmacia.subscribe(res => {
        console.log(res)
        this.currentFarmacia = res.result
        this.isLoadingResults = false
        this.initValores()
      }, (err => {
        console.log(err)
        this.isLoadingResults = false
        this._zonasServ.notify('Ocurrio un error con la petición', 'error')
      }))
    }
    this.ciudades = this._zonasServ.listCiudades
  }

  initValores(){
    this.farmaForm.patchValue({
      name: this.currentFarmacia.name,
      adress: this.currentFarmacia.adress,
      cityId: this.currentFarmacia.cityId
    })
  }

  resetForm(){
    this.farmaForm.reset()
  }

  save(){
    if(this.data.farmaId){
      const peticion = this._farmaServ.updateFarmacia(this.farmaForm.value, this.data.farmaId, this.currentFarmacia.isDeleted)
       peticion.subscribe(() => {
        this._zonasServ.notify('Farmacia actualizada', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._zonasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }else{
      const peticion = this._farmaServ.addFarmacia(this.farmaForm.value)
      peticion.subscribe(() => {
        this._zonasServ.notify('Farmacia registrada', 'success')
        this.dialogo.close(true);
      }, (err => {
        console.log(err)
        this._zonasServ.notify('Ocurrio un error con el proceso', 'error')
      }))
    }
  }
}
