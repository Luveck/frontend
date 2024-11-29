import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { Pais } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-detalle-pais',
  templateUrl: './detalle-pais.html',
  styleUrls: ['./detalle-pais.scss'],
})

export class DetallePais implements OnInit {
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
    public dialogo: MatDialogRef<DetallePais>,
    public sharedService: SharedService,
    public apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    if(this.data.paisId){
      this.getCountry();
    }
  }

  public async getCountry(){
    try {
      this.currentPais = await this.apiService.get<Pais>(`Country/${this.data.paisId}`);
      this.initValores()
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con la petición', 'error')

    } finally {
      this.isLoadingResults = false

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
    let country: any = {
      name: this.paisForm.value.name,
      iso3: this.paisForm.value.iso3,
      phoneCode: this.paisForm.value.phoneCode,
      currency: this.paisForm.value.currency,
      currencyName: this.paisForm.value.currencyName,
      currencySymbol: this.paisForm.value.currencySymbol,
      Ip: this.sharedService.userIP,
      Device: this.sharedService.userDevice,
    }
    if(this.data.paisId){
      country = {
        ...country,
        id: this.data.paisId,
        IsActive: this.currentPais.isActive
      }
      this.updateCountry(country);
    }else{
      country = {
        ...country,
        IsActive: true,
      }
      this.saveCountry(country);
    }
  }

  public async saveCountry(counrty : any) {
    try {
      const res = await this.apiService.post(`Country`, counrty)
      this.sharedService.notify('País actualizado', 'success')
      this.dialogo.close(true)
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con la petición', 'error')
    } finally {
      this.isLoadingResults = false
    }
  }

  public async updateCountry(counrty : any){
    try {
      const res = await this.apiService.put(`Country`, counrty)
      this.sharedService.notify('País actualizado', 'success')
      this.dialogo.close(true)
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con la petición', 'error')
    } finally {
      this.isLoadingResults = false
    }
  }
}
