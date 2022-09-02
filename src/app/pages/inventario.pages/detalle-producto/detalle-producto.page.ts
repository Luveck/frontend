import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Producto } from 'src/app/interfaces/models'
import { DataService } from 'src/app/services/data.service'
import { ProductosService } from 'src/app/services/productos.service'

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})

export class DetalleProductoPage implements OnInit {
  public prodId!: string
  currentProd!: Producto

  public prodForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    presentation: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    typeSell: new FormControl('', Validators.required),
    cost: new FormControl('', Validators.required),
    nameCategory: new FormControl('', Validators.required),
  })

  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/'
      },
      {
        name: 'Gestión de productos',
        isLink: true,
        link: '/admin/inventario/productos'
      },
      {
        name: 'Detalle producto',
        isLink: false
      }
    ]
  }

  constructor(
    private _route: ActivatedRoute,
    private _prodServ: ProductosService,
    private _dataServ: DataService,
  ){}

  ngOnInit(): void {
    this.prodId = this._route.snapshot.params['id']
    this.prodId != 'new'
      ?this.getPaisById()
      :null
  }

  getPaisById(){
    this.currentProd = this._prodServ.productos[this.prodId]
    this.initValores()
/*     let res = this._prodServ.getCategoriaById(this.prodId)
    res.subscribe(data => {
      this.currentProd = data
      this.initValores()
    }, (err => console.log(err))) */
  }

  initValores(){
    this.prodForm.patchValue({
      name: this.currentProd.name,
      description: this.currentProd.description,
      presentation: this.currentProd.presentation,
      quantity: this.currentProd.quantity,
      typeSell: this.currentProd.typeSell,
      cost: this.currentProd.cost,
      nameCategory: this.currentProd.name
    })
  }

  resetForm(){
    this.prodForm.reset()
  }

  save(){
    if(this.prodId === 'new'){
      let data = {
        ...this.prodForm.value,
        "status": true,
        "createBy": "Elvin",
        "creationDate": new Date().toISOString(),
        "updateBy": "elvin",
        "updateDate": new Date().toISOString()
      }
      let peticion = this._prodServ.updateProd(data)
  /*     peticion.subscribe(res => {
        this._dataServ.fir('Registro agregado', 'success')
        this._dataServ.goBack()
      }, err => console.log(err)) */
    }else{
      let data = {
        "id": parseInt(this.prodId),
        ...this.prodForm.value,
        "createBy": this.currentProd.createBy,
        "creationDate": this.currentProd.creationDate,
        "updateBy": "elvin",
        "updateDate": new Date().toISOString()
      }
      let peticion = this._prodServ.addProducto(data)
/*       peticion.subscribe(res => {
        this._dataServ.fir('Registro actualizado', 'success')
        this._dataServ.goBack()
      }, err => console.log(err)) */
    }
  }
}
