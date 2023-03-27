import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Producto } from 'src/app/interfaces/models';
import { InventarioService } from 'src/app/services/inventario.service';
import { DataService } from 'src/app/services/data.service';
import { DetalleProducto } from '../detalle-producto/detalle-producto';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})

export class ProductosPage implements AfterViewInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de productos',
        isLink: false,
      }
    ]
  }

  @Input('ELEMENT_DATA')  ELEMENT_DATA!:Producto[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns: string[] = ['name', 'cost', 'nameCategory', 'state', 'creationDate', 'acctions'];
  dataSource = new MatTableDataSource<Producto>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog:MatDialog,
    public _inveServ:InventarioService,
    private _dataServ:DataService
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllProduct()
  }

  getAllProduct(){
    let resp = this._inveServ.getProductos()
    resp.subscribe(productos => {
      this.dataSource.data = productos.result as Producto[]
      this._inveServ.listProducts = productos.result
      this.isLoadingResults = false
      console.log(this.dataSource.data)
    }, (err => {
      this.isLoadingResults = false
      console.log(err)
    }))
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  on(id?:string){
    this._dataServ.goTo(`admin/inventario/producto-detalle/${id}`)
/*     const config = {
      data: {
        title: id ?'Editar Producto' :'Agregar Producto',
        productoId: id
      }
    }
    this._dialog.open(DetalleProducto, config)
    .afterClosed()
    .subscribe((confim:boolean) => {
      if(confim){
        this.isLoadingResults = true
        this.getAllProduct()
      }
    }) */
  }

  chageState(row:Producto){
    const formData = {
      "name": row.name,
      "barcode": row.barcode,
      "description": row.description,
      "presentation": row.presentation,
      "quantity": row.quantity,
      "typeSell": row.typeSell,
      "cost": row.cost,
      "idCategory": row.idCategory
    }
    let msgDialog:string
    if(row.state){
      msgDialog = '¿Seguro de querer inhabilitar este producto?'
    }else{
      msgDialog = '¿Seguro de querer habilitar este producto?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        row.state = !row.state
        const res = this._inveServ.updateProd(formData, row.id, row.state)
          res.subscribe(res => {
            if(res){
              this._inveServ.notify('Producto actualizado', 'success')
              this.isLoadingResults = true
              this.getAllProduct()
            }
          }, (err => {
            console.log(err)
            this._inveServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  generateReport(){
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Productos',
        'body': this.dataSource.data
      }
    })
  }
}
