import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { InventarioService } from 'src/app/services/inventario.service';
import { Producto } from 'src/app/interfaces/models';
import { DataService } from 'src/app/services/data.service';
import { DetalleProductoPage } from '../detalle-producto/detalle-producto.page';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})

export class productosPage implements AfterViewInit {
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
  displayedColumns: string[] = ['name', 'cost', 'state', 'nameCategory', 'acctions'];
  dataSource = new MatTableDataSource<Producto>(this.ELEMENT_DATA);

  resultsLength = 0;
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
    this.cargarAllProduct()
  }

  cargarAllProduct(){
    let resp = this._inveServ.getAllProductos()
    resp.subscribe(productos => {
      this.dataSource.data = productos.result as Producto[]
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
    const config = {
      data: {
        title: id ?'Editar Producto' :'Agregar Producto',
        productoId: id
      }
    }
    this._dialog.open(DetalleProductoPage, config)
    .afterClosed()
    .subscribe(() => {
      this.isLoadingResults = true
      this.cargarAllProduct()
    })
  }
}
