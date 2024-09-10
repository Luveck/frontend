import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Pais } from 'src/app/interfaces/models';
import { ZonasService } from 'src/app/services/zonas.service';
import { DetallePais } from '../detalle-pais/detalle-pais';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.page.html',
  styleUrls: ['./paises.page.scss'],
})

export class PaisesPage implements AfterViewInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de paises',
        isLink: false,
      }
    ]
  }

  @Input('ELEMENT_DATA')  ELEMENT_DATA!:Pais[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns: string[] = ['name', 'currency', 'phoneCode', 'status', 'acctions'];
  dataSource = new MatTableDataSource<Pais>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _zonasServ:ZonasService
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllCountries()
  }

  getAllCountries() {
    const resp = this._zonasServ.getPaises()
    resp?.subscribe(paises => {
      this.dataSource.data = paises.result as Pais[]
      this._zonasServ.listPaises = paises.result
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
        title: id ?'Editar País' :'Agregar País',
        paisId: id
      }
    }
    this._dialog.open(DetallePais, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getAllCountries()
      }
    })
  }

  chageState(row:Pais){
    const formData = {
      "name": row.name,
      "iso3": row.iso3,
      "phoneCode": row.phoneCode,
      "currency": row.currency,
      "currencyName": row.currencyName,
      "currencySymbol": row.currencySymbol
    }
    let msgDialog:string
    if(row.status){
      msgDialog = '¿Seguro de querer inhabilitar este país?'
    }else{
      msgDialog = '¿Seguro de querer habilitar este país?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        row.status = !row.status
        const res = this._zonasServ.updatePais(formData, row.id, row.status)
          res?.subscribe(res => {
            if(res){
              this._zonasServ.notify('País actualizado', 'success')
              this.isLoadingResults = true
              this.getAllCountries()
            }
          }, (err => {
            console.log(err)
            this._zonasServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  generateReport(){
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Paises',
        'body': this.dataSource.data
      }
    })
  }
}
