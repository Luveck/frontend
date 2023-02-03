import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Venta } from 'src/app/interfaces/models';
import { DetalleVenta } from '../detalle-ventas/detalle-venta';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { VentasService } from 'src/app/services/ventas.service';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})

export class VentasPage implements AfterViewInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de Ventas',
        isLink: false,
      }
    ]
  }

  @Input('ELEMENT_DATA')  ELEMENT_DATA!:Venta[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns:string[] = ['noPurchase', 'namePharmacy', 'reviewed', 'creationDate', 'acctions'];
  dataSource = new MatTableDataSource<Venta>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _ventasServ:VentasService,
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllVentas()
  }

  getAllVentas() {
    const resp = this._ventasServ.getVentas()
    resp.subscribe(ventas => {
      this.dataSource.data = ventas.result as Venta[]
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

  on(row?:Venta){
    const config = {
      data: {
        title: row?.id ?'Editar Venta' :'Agregar Venta',
        ventaId: row?.id,
        currentVenta: row
      }
    }
    this._dialog.open(DetalleVenta, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getAllVentas()
      }
    })
  }

  chageState(row:Venta){
    const formData = {
      "pharmacyId": row.idPharmacy,
      "userId": row.buyer,
      "noPurchase": row.noPurchase
    }
    let msgDialog:string
    if(!row.reviewed){
      msgDialog = '¿Seguro de querer verificar esta venta?'
    }else{
      msgDialog = '¿Seguro de querer invalidar esta venta?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        row.reviewed = !row.reviewed
        const res = this._ventasServ.updateVenta(formData, row.id, row.reviewed)
          res.subscribe(res => {
            if(res){
              this._ventasServ.notify('Venta velidada', 'success')
              this.isLoadingResults = true
              this.getAllVentas()
            }
          }, (err => {
            console.log(err)
            this._ventasServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  generateReport(){
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Ventas',
        'body': this.dataSource.data
      }
    })
  }
}
