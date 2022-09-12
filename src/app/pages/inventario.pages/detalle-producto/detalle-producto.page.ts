import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { Categoria, Producto } from 'src/app/interfaces/models'
import { DataService } from 'src/app/services/data.service'
import { InventarioService } from 'src/app/services/inventario.service'

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})

export class DetalleProductoPage implements OnInit {
  public prodId!: string
  currentProd!: Producto | undefined
  cats!: Categoria[]
  categoriaTemp!: Categoria
  isLoadingResults?:boolean

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
    private _dataServ:DataService,
    private _inveServ: InventarioService,
  ){}

  ngOnInit(): void {
    this.prodId = this._route.snapshot.params['id']
    this.cats = this._inveServ.categorias
    this.prodId != 'new'
      ?this.getProdById()
      :null
  }

  getProdById(){
    this.isLoadingResults = true
    let res = this._inveServ.getProductoById(this.prodId)
    res.subscribe(data => {
      this.currentProd = data
      this.isLoadingResults = false
      this.initValores()
    }, (err => console.log(err)))
  }

  initValores(){
    this.prodForm.patchValue({
      name: this.currentProd!.name,
      description: this.currentProd!.description,
      presentation: this.currentProd!.presentation,
      quantity: this.currentProd!.quantity,
      typeSell: this.currentProd!.typeSell,
      cost: this.currentProd!.cost,
      nameCategory: this.currentProd!.name
    })
  }

  resetForm(){
    this.prodForm.reset()
  }

  save(){
    let catSelect = parseInt(this.prodForm.get('nameCategory')?.value!)
    this.categoriaTemp = this.cats[catSelect]
    if(this.prodId === 'new'){
      let peticion = this._inveServ.addProducto(this.prodForm.value, this.categoriaTemp)
      peticion.subscribe(res => {
        this._inveServ.notify('Producto registrado', 'success')
        this._dataServ.goBack()
      }, err => console.log(err))
    }else{
      let peticion = this._inveServ.updateProd(this.prodForm.value, this.categoriaTemp, parseInt(this.prodId))
      peticion.subscribe(res => {
        this._inveServ.notify('Registro actualizado', 'success')
        this._dataServ.goBack()
      }, err => console.log(err))
    }
  }
}
