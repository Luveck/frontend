import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Producto } from 'src/app/interfaces/models';
import { InventarioService } from 'src/app/services/inventario.service';
import { DataService } from 'src/app/services/data.service';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})

export class ProductosPage implements OnInit {
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
  displayedColumns: string[] = ['name', 'nameCategory', 'country', 'isActive', 'acctions'];
  dataSource = new MatTableDataSource<Producto>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true;

  constructor(
    private readonly _liveAnnouncer: LiveAnnouncer,
    private readonly _dialog:MatDialog,
    public readonly inveServ:InventarioService,
    public readonly sharedService: SharedService,
    public readonly apiService: ApiService,
    private readonly _dataServ:DataService
  ){}

  ngOnInit(): void{
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getProducts()
  }

  public async getProducts() {
    try {
      this.isLoadingResults = true;
      await this.inveServ.setProducts();
      this.dataSource.data = this.inveServ.getProducts();
    } catch (err) {
      this.sharedService.notify('Ocurrio un error consultando los productos.', 'error');
    } finally {
      this.isLoadingResults = false;
    }
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
  }

  chageState(row:any){
    this.isLoadingResults = true;
    let product: any = {
      name: row.name,
      barcode: row.barcode,
      description: row.description,
      presentation: row.presentation,
      quantity: row.quantity,
      typeSell: row.typeSell,
      cost: row.cost,
      descuento: '',
      urlOficial: '',
      categoryId: row.category.id,
      countryId : '1',
      Ip: this.sharedService.userIP,
      Device: this.sharedService.userDevice,
      isActive : !row.isActive,
      id: row.id
    }
    let msgDialog:string
    if(row.isActive){
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
        this.changeState(product)
      }
    })
  }

  private async changeState(product: any){
    try {
      await this.apiService.put('Product', product);
      this.sharedService.notify('Producto actualizado', 'success');
      this.getProducts();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con la petición', 'error')
    } finally {
      this.isLoadingResults = false;
    }
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
