import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Departamento } from 'src/app/interfaces/models';
import { Detalledepartamento } from '../detalle-departamento/detalle-departamento';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.page.html',
  styleUrls: ['./departamentos.page.scss'],
})

export class DepartamentosPage implements OnInit {
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
  displayedColumns:string[] = ['name', 'countryName', 'countryCode', 'status', 'acctions'];
  dataSource = new MatTableDataSource<Departamento>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true

  constructor(
    private readonly _liveAnnouncer: LiveAnnouncer,
    private readonly _dialog: MatDialog,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
  ){}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.sharedService.getDepartmentList();
    if (this.sharedService.getDepartmentList().length == 0)(
      this.getDepartments()
    )
    this.isLoadingResults = false
  }

  public async getDepartments() {
    try {
      await this.sharedService.setDepartments();
      this.dataSource.data = this.sharedService.getDepartmentList();
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso.', 'error')
    } finally {
      this.isLoadingResults = false
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
    const config = {
      data: {
        title: id ?'Editar Departamento' :'Agregar Departamento',
        departamentoId: id
      }
    }
    this._dialog.open(Detalledepartamento, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getDepartments()
      }
    })
  }

  chageState(row:Departamento){
    let msgDialog:string
    if(row.isActive){
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
        const department = {
          'id': row.id,
          'name': row.name,
          'countryId': row.countryId,
          'isActive': !row.isActive,
          'Ip': this.sharedService.userIP,
          'Device': this.sharedService.getUserDevice
        }
        this.isLoadingResults = true
        this.updateState(department);
      }
    })
  }

  generateReport(){
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Departamentos',
        'body': this.dataSource.data
      }
    })
  }

  public async updateState(departement: any) {
    try {
      await this.apiService.put('Department',departement)
      this.getDepartments();
      this.sharedService.notify('Departamento actualizado', 'success')
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con el proceso.', 'error')
    } finally {
      this.isLoadingResults = false
    }
  }
}
