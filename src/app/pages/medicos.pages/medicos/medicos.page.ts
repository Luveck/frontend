import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Medico } from 'src/app/interfaces/models';
import { MedicosService } from 'src/app/services/medicos.service';
import { DetalleMedicoPage } from '../detalle-medico/detalle-medico.page';

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
        name: 'Gestión de Medicos',
        isLink: false,
      }
    ]
  }

  @Input('ELEMENT_DATA')  ELEMENT_DATA!:Medico[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns: string[] = ['name', 'register', 'isDeleted', 'patologyName', 'creationDate', 'acctions'];
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
    let resp = this._medicServ.getAllMedicos()
    resp.subscribe(Medicos => {
      this.dataSource.data = Medicos as Medico[]
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
        title: id ?'Editar Medico' :'Agregar Medico',
        medicoId: id
      }
    }
    this._dialog.open(DetalleMedicoPage, config)
    .afterClosed()
    .subscribe(() => {
      this.isLoadingResults = true
      this.getAllMedics()
    })
  }

  dialog(medico:Medico) {
    if(!medico.isDeleted){
      this._dialog.open(DialogConfComponent, {
        data: `¿Seguro de querer inhabilitar la cuenta de este medico?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          const res = this._medicServ.deleteMedico(medico.id!)
          res.subscribe(res => {
            if(res){
              this._medicServ.notify('Cuenta inhabilidata', 'success')
              this.isLoadingResults = true
              this.getAllMedics()
            }
          }, (err => {
            console.log(err)
            this._medicServ.notify('Ocurrio un error', 'error')
          }))
        }
      })
    }else{
      this._dialog.open(DialogConfComponent, {
        data: `¿Seguro de querer habilitar la cuenta de este medico?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          const res = this._medicServ.changeStateMedico(false, medico)
          res.subscribe(res => {
            if(res){
              this._medicServ.notify('Cuenta restaurada', 'success')
              this.isLoadingResults = true
              this.getAllMedics()
            }
          }, (err => {
            console.log(err)
            this._medicServ.notify('Ocurrio un error', 'error')
          }))
        }
      })
    }
  }
}
