import { Component, OnInit } from '@angular/core'
import { ActivatedRoute} from '@angular/router'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog';

import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Categoria, FilesToProduct, Producto } from 'src/app/interfaces/models'
import { InventarioService } from 'src/app/services/inventario.service'
import { ImageValidator } from './imageValidator';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.html',
  styleUrls: ['./detalle-producto.scss'],
  providers:[ImageValidator]
})

export class DetalleProducto implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de productos',
        isLink: true,
        link: '/admin/inventario/productos'
      },
      {
        name: 'Detalles del producto',
        isLink: false,
      }
    ]
  }

  prodId!:string
  currentProd!: Producto | any
  cats!: Categoria[]
  isLoadingResults!:boolean

  files: File[] = [];
  isOverDrop = false;
  filesFormated: FilesToProduct[] = []

  public prodForm = new FormGroup({
    name: new FormControl('', Validators.required),
    barcode: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    presentation: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    typeSell: new FormControl('', Validators.required),
    cost: new FormControl('', Validators.required),
    idCategory: new FormControl('',Validators.required),
  })

  constructor(
    private _inveServ: InventarioService,
    private _route: ActivatedRoute,
    private _dialogo: MatDialog,
    private _validate:ImageValidator,
  ){}

  ngOnInit(): void {
    this.prodId = this._route.snapshot.params['id']
    if(!this._inveServ.categorias){
      const res = this._inveServ.getCategories()
      res.subscribe((res:any) => this.cats = res.result)
    }else{
      this.cats = this._inveServ.categorias
    }
    if(this.prodId != 'new'){
      this.isLoadingResults = true
      const prod = this._inveServ.getProductoById(this.prodId)
      prod.subscribe((res:any) => {
        console.log(res)
        this.currentProd = res.result
        this.isLoadingResults = false
        this.initValores()
      }, (err => {
        console.log(err)
        this.isLoadingResults = false
        this._inveServ.notify('Ocurrio un error con la petición', 'error')
      }))
    }
  }

  initValores(){
    this.prodForm.patchValue({
      name: this.currentProd.name,
      barcode: this.currentProd.barcode,
      description: this.currentProd.description,
      presentation: this.currentProd.presentation,
      quantity: this.currentProd.quantity,
      typeSell: this.currentProd.typeSell,
      cost: this.currentProd.cost,
      idCategory: this.currentProd.idCategory
    })
  }

  resetForm(){
    this.prodForm.reset()
  }

  generateImg(){
    this.files.forEach(file => {
      this.convertFileToBase64(file)
    })
  }

  convertFileToBase64(file:File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let fileStringBase64: any = reader.result;
      let element:FilesToProduct = {
        fileBase64: fileStringBase64.split(',')[1],
        name: file.name,
        typeFile: file.type
      }
      this.filesFormated.push(element)
    };
  }

  save(){
    if(this.files.length == 0){
      this._inveServ.notify('El registro del producto debe temer por lo menos una imágen.', 'info')
      return
    }
    if(this.prodId != 'new'){
      this.generateImg()
      const peticion = this._inveServ.updateProd(this.prodForm.value, parseInt(this.prodId), this.currentProd.state)
      peticion.subscribe(() => {
        this._inveServ.notify('Registro actualizado', 'success')
      }, err => {
        console.log(err)
        this._inveServ.notify('Ocurrio un error', 'error')
      })
    }else{
      this.generateImg()
      const peticion = this._inveServ.addProducto(this.prodForm.value, this.filesFormated)
      peticion.subscribe(() => {
        this._inveServ.notify('Producto registrado', 'success')
      }, err => {
        console.log(err)
        this._inveServ.notify('Ocurrio un error', 'error')
      })
    }
  }

  clear(index:number){
    this.files.splice(index, 1)
  }

  onSelectFile(event:any){
    for(const item of event.target.files){
      if(this._validate.validateType(item.type)){
        const newFile = item;
        this.files.push(newFile);
      }
    }
  }
}
