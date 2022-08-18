import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Pais } from 'src/app/interfaces/zonas.model'
import { DataService } from 'src/app/services/data.service'
import { ZonasService } from 'src/app/services/zonas.service'

@Component({
  selector: 'app-detalle-pais',
  templateUrl: './detalle-pais.page.html',
  styleUrls: ['./detalle-pais.page.scss'],
})

export class DetallePaisPage implements OnInit {
  public paisId !: string
  private currentPais !: Pais

  public newPaisForm = new FormGroup({
    name: new FormControl('', Validators.required),
    iso3: new FormControl('', Validators.required),
    phoneCode: new FormControl('', Validators.required),
    currency: new FormControl('', Validators.required),
    currencyName: new FormControl('', Validators.required),
    currencySymbol: new FormControl('', Validators.required)
  })

  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/'
      },
      {
        name: 'Gestión de paises',
        isLink: true,
        link: '/admin/zonas/paises'
      },
      {
        name: 'Detalle país',
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
    this.paisId = this._route.snapshot.params['id']
    this.paisId != 'new'
      ?this.getPaisById()
      :null
  }

  getPaisById(){
    let res = this._zonasServ.getPaisById(this.paisId)
    res.subscribe(data => {
      this.currentPais = data
      this.initValores()
    }, (err => console.log(err)))
  }

  initValores(){
    this.newPaisForm.patchValue({
      name: this.currentPais.name,
      iso3: this.currentPais.iso3,
      phoneCode: this.currentPais.phoneCode,
      currency: this.currentPais.currency,
      currencyName: this.currentPais.currencyName,
      currencySymbol: this.currentPais.currencySymbol
    })
  }

  resetForm(){
    this.newPaisForm.reset()
  }

  addPais(){
    if(this.paisId === 'new'){
      let data = {
        ...this.newPaisForm.value,
        "status": true,
        "createBy": "Elvin",
        "creationDate": new Date().toISOString(),
        "updateBy": "elvin",
        "updateDate": new Date().toISOString()
      }
      let peticion = this._zonasServ.addOrUpdatePais(data)
      peticion.subscribe(res => {
        this._dataServ.fir('Registro agregado', 'success')
        this._dataServ.goBack()
      }, err => console.log(err))
    }else{
      let data = {
        "id": parseInt(this.paisId),
        ...this.newPaisForm.value,
        "status": this.currentPais.status,
        "createBy": this.currentPais.createBy,
        "creationDate": this.currentPais.creationDate,
        "updateBy": "elvin",
        "updateDate": new Date().toISOString()
      }
      let peticion = this._zonasServ.addOrUpdatePais(data)
      peticion.subscribe(res => {
        this._dataServ.fir('Registro actualizado', 'success')
        this._dataServ.goBack()
      }, err => console.log(err))
    }
  }
}
