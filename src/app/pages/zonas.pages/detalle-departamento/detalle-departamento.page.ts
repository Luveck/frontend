import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Departamento, Pais } from 'src/app/interfaces/models'
import { ZonasService } from 'src/app/services/zonas.service'

@Component({
  selector: 'app-detalle-departamento',
  templateUrl: './detalle-departamento.page.html',
  styleUrls: ['./detalle-departamento.page.scss'],
})

export class DetalledepartamentoPage implements OnInit {
  currentDepartamento !: Departamento | undefined
  isLoadingResults?:boolean
  paises!: Pais[]
  paisTemp?: Pais
  departamentos: any

  public newDepartamentoForm = new FormGroup({
    country: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
  })

  constructor(
    public zonasServ:ZonasService,
    public dialogo: MatDialogRef<DetalledepartamentoPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    this.paises = this.zonasServ.listPaises
    if(this.data.departamentoId){
      this.isLoadingResults = true
      const departamento = this.zonasServ.getDepartamentoById(this.data.departamentoId)
      departamento.subscribe(res => {
        this.currentDepartamento = res.result
        this.isLoadingResults = false
        this.initValores()
      }, (err => console.log(err)))
    }
  }

  selectPais(event:any){
    this.paisTemp = this.paises[event.value]
  }

  initValores(){
    this.newDepartamentoForm.patchValue({
      name: this.currentDepartamento!.name,
    })
  }

  resetForm(){
    this.newDepartamentoForm.reset()
  }

  addEditCiudad(){
    const dataDepartamento = {
      name: this.newDepartamentoForm.value.name,
      idCountry: this.paisTemp?.id,
    }
    if(!this.data.departamentoId){
      let peticion = this.zonasServ.addDepartamento(dataDepartamento)
      peticion.subscribe(() => {
        this.zonasServ.notify('Departamento registrado', 'success')
        this.dialogo.close(true);
      }, err => console.log(err))
    }else{
      let peticion = this.zonasServ.updateCiudad(this.newDepartamentoForm.value, parseInt(this.data.departamentoId))
      peticion.subscribe(() => {
        this.zonasServ.notify('Registro actualizado', 'success')
        this.dialogo.close(true);
      }, err => console.log(err))
    }
  }
}
