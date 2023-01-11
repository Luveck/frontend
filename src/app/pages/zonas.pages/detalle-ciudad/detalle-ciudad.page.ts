import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Ciudad, Pais } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'

@Component({
  selector: 'app-detalle-ciudad',
  templateUrl: './detalle-ciudad.page.html',
  styleUrls: ['./detalle-ciudad.page.scss'],
})

export class DetalleCiudadPage implements OnInit {
  currentCiudad !: Ciudad | undefined
  isLoadingResults?:boolean
  paises!: Pais[]
  paisTemp?: Pais
  departamentos: any

  public newCiudadForm = new FormGroup({
    name: new FormControl('', Validators.required),
    countryName: new FormControl('', Validators.required),
    stateName: new FormControl('', Validators.required),
  })

  constructor(
    public zonasServ:ZonasService,
    public dialogo: MatDialogRef<DetalleCiudadPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    this.paises = this.zonasServ.listPaises
    if(this.data.ciudadId){
      this.isLoadingResults = true
      const ciudad = this.zonasServ.getCiudadById(this.data.ciudadId)
      ciudad.subscribe(res => {
        this.currentCiudad = res
        this.isLoadingResults = false
        this.initValores()
      }, (err => console.log(err)))
    }
  }

  selectPais(event:any){
    this.paisTemp = this.paises[event.value]
    //this.zonasServ.getDepartamentosByPais(this.paisTemp.name).subscribe(res => this.departamentos = res)
  }

  initValores(){
    this.newCiudadForm.patchValue({
      name: this.currentCiudad!.name,

//      stateId: this.currentCiudad.stateId.toString()
    })
  }

  resetForm(){
    this.newCiudadForm.reset()
  }

  addEditCiudad(){
    if(!this.data.ciudadId){
      let peticion = this.zonasServ.updateCiudad(this.newCiudadForm.value)
      peticion.subscribe(() => {
        this.zonasServ.notify('Ciudad registrada', 'success')
        this.dialogo.close(true);
      }, err => console.log(err))
    }else{
      let peticion = this.zonasServ.updateCiudad(this.newCiudadForm.value, parseInt(this.data.ciudadId))
      peticion.subscribe(() => {
        this.zonasServ.notify('Registro actualizado', 'success')
        this.dialogo.close(true);
      }, err => console.log(err))
    }
  }
}
