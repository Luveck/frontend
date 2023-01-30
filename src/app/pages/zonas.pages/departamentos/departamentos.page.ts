import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Departamento } from 'src/app/interfaces/models';
import { ZonasService } from 'src/app/services/zonas.service';
import { DetalledepartamentoPage } from '../detalle-departamento/detalle-departamento.page';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.page.html',
  styleUrls: ['./departamentos.page.scss'],
})

export class DepartamentosPage implements AfterViewInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de Departamentos',
        isLink: false,
      }
    ]
  }

  @Input('ELEMENT_DATA')  ELEMENT_DATA!:Departamento[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns:string[] = ['name', 'countryName', 'countryCode', 'status', 'creationDate', 'acctions'];
  dataSource = new MatTableDataSource<Departamento>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _zonasServ:ZonasService,
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllDepartamentos()
  }

  getAllDepartamentos() {
    const resp = this._zonasServ.getDepartamentos()
    resp.subscribe(departamentos => {
      this.dataSource.data = departamentos.result as Departamento[]
      this._zonasServ.listDepartamentos = departamentos.result
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
        title: id ?'Editar Departamento' :'Agregar Departamento',
        departamentoId: id
      }
    }
    this._dialog.open(DetalledepartamentoPage, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getAllDepartamentos()
      }
    })
  }

  chageState(row:Departamento){
    const formData = {
      "name": row.name,
      "idCountry": row.countryId
    }
    let msgDialog:string
    if(row.status){
      msgDialog = '¿Seguro de querer inhabilitar este departamento?'
    }else{
      msgDialog = '¿Seguro de querer habilitar este departamento?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        row.status = !row.status
        const res = this._zonasServ.updateDepartamento(formData, row.id, row.status)
          res.subscribe(res => {
            if(res){
              this._zonasServ.notify('Departamento actualizado', 'success')
              this.isLoadingResults = true
              this.getAllDepartamentos()
            }
          }, (err => {
            console.log(err)
            this._zonasServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  generateReport(){
    console.log('voy a generar el reporte xd')
  }
}
