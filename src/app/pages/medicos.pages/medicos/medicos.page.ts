import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Medico } from 'src/app/interfaces/models';
import { MedicosService } from 'src/app/services/medicos.service';
import { DetalleMedico } from '../detalle-medico/detalle-medico';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.page.html',
  styleUrls: ['./medicos.page.scss'],
})

export class MedicosPage implements AfterViewInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de Médicos',
        isLink: false,
      }
    ]
  }

  @Input('ELEMENT_DATA')  ELEMENT_DATA!:Medico[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns: string[] = ['name', 'patologyName', 'isDeleted', 'acctions'];
  dataSource = new MatTableDataSource<Medico>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog:MatDialog,
    public _medicServ:MedicosService
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllMedics()
  }

  getAllMedics(){
    let resp = this._medicServ.getMedicos()
    resp?.subscribe(medicos => {
      this.dataSource.data = medicos.result as Medico[]
      this.isLoadingResults = false
    }, (err => {
      this.isLoadingResults = false
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
        title: id ?'Editar Médico' :'Agregar Médico',
        medicoId: id
      }
    }
    this._dialog.open(DetalleMedico, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getAllMedics()
      }
    })
  }

  chageState(row:Medico){
    const formData = {
      "name": row.name,
      "register": row.register,
      "patologyId": row.patologyId
    }
    let msgDialog:string
    if(row.isActive){
      msgDialog = '¿Seguro de querer inhabilitar el registro de este médico?'
    }else{
      msgDialog = '¿Seguro de querer habilitar el registro de este médico?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        row.isActive = !row.isActive
        const res = this._medicServ.updateMedico(formData, row.id, row.isActive)
          res?.subscribe(res => {
            if(res){
              this._medicServ.notify('Médico actualizado', 'success')
              this.isLoadingResults = true
              this.getAllMedics()
            }
          }, (err => {
            console.log(err)
            this.getAllMedics()
            this._medicServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  generateReport(){
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Médicos',
        'body': this.dataSource.data
      }
    })
  }
}
