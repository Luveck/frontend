import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Farmacia } from 'src/app/interfaces/models';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { DetalleFarmacia } from '../detalle-farmacia/detalle-farmacia';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { ModalReportComponent } from 'src/app/components/modal-report/modal-report.component';

@Component({
  selector: 'app-farmacias',
  templateUrl: './farmacias.page.html',
  styleUrls: ['./farmacias.page.scss'],
})

export class FarmaciasPage implements AfterViewInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de Farmacias',
        isLink: false,
      }
    ]
  }

  @Input('ELEMENT_DATA')  ELEMENT_DATA!:Farmacia[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns: string[] = ['name', 'city', 'isDeleted', 'acctions'];
  dataSource = new MatTableDataSource<Farmacia>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _farmaServ:FarmaciasService
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllFarmacias()
  }

  getAllFarmacias(){
    const resp = this._farmaServ.getFarmacias()
    resp?.subscribe(farmas => {
      this.dataSource.data = farmas.result as Farmacia[]
      this._farmaServ.listFarmacias = farmas.result
      this.isLoadingResults = false
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
        title: id ?'Editar Farmacia' :'Agregar Farmacia',
        farmaId: id
      }
    }
    this._dialog.open(DetalleFarmacia, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getAllFarmacias()
      }
    })
  }

  chageState(row:Farmacia){
    const formData = {
      "name": row.name,
      "adress": row.adress,
      "cityId": row.cityId
    }
    let msgDialog:string
    if(row.isActive){
      msgDialog = '¿Seguro de querer inhabilitar esta farmacia?'
    }else{
      msgDialog = '¿Seguro de querer habilitar esta farmacia?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        row.isActive = !row.isActive
        const res = this._farmaServ.updateFarmacia(formData, row.id, row.isActive)
          res?.subscribe(res => {
            if(res){
              this._farmaServ.notify('Farmacia actualizada', 'success')
              this.isLoadingResults = true
              this.getAllFarmacias()
            }
          }, (err => {
            console.log(err)
            this.getAllFarmacias()
            this._farmaServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  generateReport() {
    this._dialog.open(ModalReportComponent, {
      disableClose: true,
      data: {
        'title': 'Reporte General de Farmacias',
        'body': this.dataSource.data
      }
    })
  }
}
