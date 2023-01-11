import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Pais } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'
import { DialogConfComponent } from '../../../components/dialog-conf/dialog-conf.component';

@Component({
  selector: 'app-detalle-pais',
  templateUrl: './detalle-pais.page.html',
  styleUrls: ['./detalle-pais.page.scss'],
})

export class DetallePaisPage implements OnInit {
  currentPais?: Pais
  isLoadingResults!:boolean
  urlFlag!:string

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
    private _dialogo:MatDialog,
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
        let msgError = err.error.messages
        this._zonasServ.notify(`${msgError}`, 'error')
      }))
    }
  }

  initValores(){
    this.urlFlag = `https://flagcdn.com/${this.currentPais?.iso3.toLowerCase()}.svg`
    this.newPaisForm.patchValue({
      name: this.currentPais?.name,
      iso3: this.currentPais?.iso3,
      phoneCode: this.currentPais?.phoneCode,
      currency: this.currentPais?.currency,
      currencyName: this.currentPais?.currencyName,
      currencySymbol: this.currentPais?.currencySymbol
    })
  }

  resetForm(){
    this.newPaisForm.reset()
  }

  changeStatus(status:boolean|undefined){
    this._dialogo.open(DialogConfComponent, {
      data: status ?`¿Seguro de querer inhabilitar este registro?` :'¿Seguro de querer habilitar este registro?'
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {

        this.addEditPais(status)
      }
    })
  }

  addEditPais(status?:boolean){
    if(!this.data.paisId){
      let peticion = this._zonasServ.addPais(this.newPaisForm.value)
      peticion.subscribe(res => {
        this._zonasServ.notify('País registrado', 'success')
        this.dialogo.close(true);
      }, err => console.log(err))
    }else{
      let peticion = this._zonasServ.updatePais(this.newPaisForm.value, this.data.paisId, (status != null) ?!this.currentPais?.status :this.currentPais?.status)
      peticion.subscribe(res => {
        this._zonasServ.notify('Registro actualizado', 'success')
        this.dialogo.close(true);
      }, err => console.log(err))
    }
  }
}
