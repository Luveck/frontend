import { Component, OnInit } from '@angular/core'
import { ActivatedRoute} from '@angular/router'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog';

import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Categoria, FilesToProduct, Pais, Producto } from 'src/app/interfaces/models'
import { InventarioService } from 'src/app/services/inventario.service'
import { ImageValidator } from './imageValidator';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

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

  currentProd!: Producto | any
  currentProdId:any
  cats!: Categoria[]
  isLoadingResults!:boolean
  image: string[] = [];
  public countries: Pais[] = [];

  files: File[] = [];
  isOverDrop = false;
  filesFormated:FilesToProduct[] = []

  public prodForm = new FormGroup({
    name: new FormControl('', Validators.required),
    barcode: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    presentation: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    typeSell: new FormControl('', Validators.required),
    countryId: new FormControl('', Validators.required),
    idCategory: new FormControl('',Validators.required),
  })

  constructor(
    private readonly inveServ: InventarioService,
    private _route: ActivatedRoute,
    private _dialog: MatDialog,
    private _validate:ImageValidator,

    private readonly apiService: ApiService,
    private readonly sharedService: SharedService
  ){}

  ngOnInit(): void {
    this.currentProdId = this._route.snapshot.params['id'];
    if(this.currentProdId != 'new'){
      this.getProduct();
    }
    this.getCategories();
  }


  private async getProduct(){
    try {
      this.isLoadingResults = true
      this.currentProd = await this.apiService.get(`Product/${this.currentProdId}`);
      this.initValores();
    } catch ( err ) {
      this.sharedService.notify('Ocurrio un error consultando el producto', 'error')
    } finally {
      this.isLoadingResults = false
    }
  }

  private async getCategories(){
    try {
      this.isLoadingResults = true
      await this.inveServ.setCategories();
      await this.sharedService.setCountry();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error consultando la informacion', 'error')
    } finally {
      this.isLoadingResults = false
      this.cats = this.inveServ.getCategories();
      this.countries = this.sharedService.getCountryList();
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
      countryId: this.currentProd.country.id,
      idCategory: this.currentProd.category.id
    })
  }

  resetForm(){
    this.prodForm.reset()
  }

  save(){
    this.isLoadingResults = true
    let product: any = {
      name: this.prodForm.value.name,
      barcode: this.prodForm.value.barcode,
      description: this.prodForm.value.description,
      presentation: this.prodForm.value.presentation,
      quantity: this.prodForm.value.quantity,
      typeSell: this.prodForm.value.typeSell,
      cost: 0,
      descuento: '',
      urlOficial: '',
      CategoryId: this.prodForm.value.idCategory,
      countryId : this.prodForm.value.countryId,
      Ip: this.sharedService.userIP,
      Device: this.sharedService.userDevice
    }
    if(this.currentProdId != 'new'){
      product = {
        ...product,
        id: this.currentProdId,
        isActive: this.currentProd.isActive
      }
      this.updateProduct(product);
    }else{
      product = {
        ...product,
        isActive: true
      }
      this.addProduct(product);
    }
  }
  private async updateProduct(product: any){
    try {
      await this.apiService.put('Product', product);
      this.sharedService.notify('Registro actualizado', 'success');
      this.getProduct();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }
  private async addProduct(product: any){
    try {
      const prod : any = await this.apiService.post('Product', product);
      this.currentProdId = prod.id;
      console.log(prod)
      this.sharedService.notify('Producto registrado', 'success');
      this.getProduct();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error', 'error');
    } finally {
      this.isLoadingResults = false;
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

  saveImages(){
    if(this.files.length == 0){
      this.sharedService.notify('El registro del producto debe tener por lo menos una imágen.', 'info');
      return
    }
    this.uploadImg();
  }
  public uploadImg() {
    const imagePromises = this.files.map(file => this.convertToBase64(file));

    Promise.all(imagePromises)
      .then((imagesBase64: string[]) => {
        // Guardar las imágenes convertidas
        this.image = imagesBase64;

        // Llamar al servicio para subir las imágenes
        this.uploadImages({
          productId: this.currentProdId,
          images: this.image,
          Ip: this.sharedService.userIP,
          Device: this.sharedService.userDevice,
        });
      })
      .catch(error => {
        console.error('Error al procesar las imágenes:', error);
        this.sharedService.notify('Ocurrió un error al procesar las imágenes', 'error');
      });
  }

  /**
   * Convierte un archivo a base64
   */
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileStringBase64 = reader.result as string;
        resolve(fileStringBase64.split(',')[1]); // Solo el contenido base64
      };
      reader.onerror = (error) => reject(error);
    });
  }

  // public uploadImg() {
  //   const imagePromises = this.files.map(file => {
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => {
  //         let fileStringBase64: any = reader.result;
  //         this.image.push(fileStringBase64.split(',')[1]);
  //         resolve(true);
  //       };
  //       reader.onerror = (error) => reject(error);
  //     });
  //   });

  //   Promise.all(imagePromises)
  //     .then(() => {

  //       this.uploadImages(imagePromises);
  //       // const uploadImages = this._inveServ.addImages({
  //       //   "productId": this.currentProdId,
  //       //   "images": this.image
  //       // });

  //       // uploadImages?.subscribe(() => {
  //       //   this._inveServ.notify('Imágenes Actualizadas', 'success');
  //       //   this.getInfoProduct();
  //       //   this.files = []
  //       // }, err => {
  //       //   this._inveServ.notify('Ocurrio un error', 'error');
  //       // });
  //     })
  //     .catch(error => {
  //       console.log('Error al procesar las imágenes:', error);
  //       //this._inveServ.notify('Ocurrió un error al procesar las imágenes', 'error');
  //     });
  // }

  private async uploadImages(images: any){
    try {
      this.isLoadingResults = true;
      await this.apiService.post('ProductImage', images);
      this.sharedService.notify('Imágenes Subidas', 'success');
      this.getProduct();

    // Limpiar archivos seleccionados
    this.files = [];
    this.image = [];
    } catch (err) {
      this.sharedService.notify('Ocurrio un error', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }


  deleteOneFile(nameFile:string, indexImgProd:number){
    if(this.currentProd?.urlImgs.length == 1){
     // this._inveServ.notify('El registro del producto debe temer por lo menos una imágen.', 'info')
      return
    }

    this._dialog.open(DialogConfComponent, {
      data: '¿Está seguro de querer eliminar esta imágen?'
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        // const peticion = this._inveServ.deleteImage({  "productId": this.currentProdId,
        //   "pathImg": nameFile})
        // peticion?.subscribe((res:any)=>{
        //   this._inveServ.notify('Imágen eliminada', 'success')
        //   this.currentProd?.urlImgs.splice(indexImgProd, 1)
        //   this.getInfoProduct();
        // })
      }
    })
  }
}
