import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, OnInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { InventarioService } from 'src/app/services/inventario.service';
import { Producto } from 'src/app/interfaces/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})

export class productosPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/'
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
  displayedColumns: string[] = ['name', 'presentation', 'quantity', 'typeSell', 'cost', 'nameCategory', 'acctions'];
  dataSource = new MatTableDataSource<Producto>(this.ELEMENT_DATA);

  resultsLength = 0;
  isLoadingResults:boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog:MatDialog,
    public _inveServ:InventarioService,
    private _dataServ:DataService
  ){}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.cargarAll()
  }

  cargarAll(){
    //this.dataSource.data = this._inveServ.productos
    let resp = this._inveServ.getAllProductos()
    resp.subscribe(productos => {
      this.dataSource.data = productos as Producto[]
      this.isLoadingResults = false
      console.log(this.dataSource.data)
    }, (err => console.log(err)))
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
    this._dataServ.goTo('admin/inventario/detalle-producto', id)
  }

  dialog(id: number) {
    this._dialog.open(DialogConfComponent, {
      data: `¿Seguro de querer eliminar este producto?`
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          let respuesta = this._inveServ.deleteProd(id)
          respuesta.subscribe(() => {
            this._dataServ.fir('Producto eliminado', 'success')
          })
        }
      })
  }
}
