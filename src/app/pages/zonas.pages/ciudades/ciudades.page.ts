import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Ciudad } from 'src/app/interfaces/models';
import { ZonasService } from 'src/app/services/zonas.service';
import { DetalleCiudad } from '../detalle-ciudad/detalle-ciudad';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';

@Component({
  selector: 'app-ciudades',
  templateUrl: './ciudades.page.html',
  styleUrls: ['./ciudades.page.scss'],
})

export class CiudadesPage implements AfterViewInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de ciudades',
        isLink: false,
      }
    ]
  }

  @Input('ELEMENT_DATA')  ELEMENT_DATA!:Ciudad[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns:string[] = ['name', 'departmentName', 'countryName', 'state', 'creationDate', 'acctions'];
  dataSource = new MatTableDataSource<Ciudad>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _zonasServ:ZonasService,
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllCities()
  }

  getAllCities() {
    const resp = this._zonasServ.getCiudades()
    resp?.subscribe(cities => {
      this.dataSource.data = cities.result as Ciudad[]
      this._zonasServ.listCiudades = cities.result
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
        title: id ?'Editar Ciudad' :'Agregar Ciudad',
        ciudadId: id
      }
    }
    this._dialog.open(DetalleCiudad, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getAllCities()
      }
    })
  }

  chageState(row:Ciudad){
    const formData = {
      "name": row.name,
      "departymentId": row.departymentId
    }
    let msgDialog:string
    if(row.state){
      msgDialog = '¿Seguro de querer inhabilitar esta ciudad?'
    }else{
      msgDialog = '¿Seguro de querer habilitar esta ciudad?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        row.state = !row.state
        const res = this._zonasServ.updateCiudad(formData, row.id, row.state)
          res?.subscribe(res => {
            if(res){
              this._zonasServ.notify('Ciudad actualizada', 'success')
              this.isLoadingResults = true
              this.getAllCities()
            }
          }, (err => {
            console.log(err)
            this.getAllCities()
            this._zonasServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  generateReport(){
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Ciudades',
        'body': this.dataSource.data
      }
    })
  }
}
