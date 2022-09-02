import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Ciudad } from 'src/app/interfaces/models'
import { DataService } from 'src/app/services/data.service'
import { ZonasService } from 'src/app/services/zonas.service'

@Component({
  selector: 'app-detalle-ciudad',
  templateUrl: './detalle-ciudad.page.html',
  styleUrls: ['./detalle-ciudad.page.scss'],
})

export class DetalleCiudadPage implements OnInit {
  public ciudadId !: string
  currentCiudad !: Ciudad
  isLoadingResults:boolean = true

  public newCiudadForm = new FormGroup({
    name: new FormControl('', Validators.required),
    stateId: new FormControl('', Validators.required),
    stateCode: new FormControl('', Validators.required),
    stateName: new FormControl('', Validators.required),
    countryId: new FormControl('', Validators.required),
    countryName: new FormControl('', Validators.required),
  })

  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/'
      },
      {
        name: 'Gestión de ciudades',
        isLink: true,
        link: '/admin/zonas/ciudades'
      },
      {
        name: 'Detalle ciudad',
        isLink: false
      }
    ]
  }

  constructor(
    private _zonasServ:ZonasService,
    private _route: ActivatedRoute,
    private _dataServ: DataService,
  ){}

  ngOnInit(): void {
    this.ciudadId = this._route.snapshot.params['id']
    this.ciudadId != 'new'
      ?this.getPaisById()
      :null
  }

  getPaisById(){
    let res = this._zonasServ.getCiudadById(this.ciudadId)
    res.subscribe(data => {
      this.currentCiudad = data
      this.isLoadingResults = false
      this.initValores()
    }, (err => console.log(err)))
  }

  initValores(){
    this.newCiudadForm.patchValue({
      name: this.currentCiudad.name,
      stateCode: this.currentCiudad.stateCode,
//      stateId: this.currentCiudad.stateId.toString()
    })
  }

  resetForm(){
    this.newCiudadForm.reset()
  }

  addEditCiudad(){
    if(this.ciudadId === 'new'){
      let data = {
        ...this.newCiudadForm.value,
        "createBy": "elvin",
        "creationDate": new Date().toISOString(),
        "updateBy": "elvin",
        "updateDate": new Date().toISOString()
      }
      let peticion = this._zonasServ.addOrUpdateCiudad(data)
      peticion.subscribe(() => {
        this._dataServ.fir('Registro agregado', 'success')
        this._dataServ.goBack()
      }, err => console.log(err))
    }else{
      let data = {
        "id": parseInt(this.ciudadId),
        ...this.newCiudadForm.value,
        "createBy": this.currentCiudad.createBy,
        "creationDate": this.currentCiudad.creationDate,
        "updateBy": "elvin",
        "updateDate": new Date().toISOString()
      }
      let peticion = this._zonasServ.addOrUpdateCiudad(data)
      peticion.subscribe(() => {
        this._dataServ.fir('Registro actualizado', 'success')
        this._dataServ.goBack()
      }, err => console.log(err))
    }
  }
}
