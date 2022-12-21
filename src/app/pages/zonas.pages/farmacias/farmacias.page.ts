import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Farmacia } from 'src/app/interfaces/models';
import { ZonasService } from 'src/app/services/zonas.service';
import { DetalleFarmaciaPage } from '../detalle-farmacia/detalle-farmacia.page';

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
  displayedColumns: string[] = ['name', 'cityName', 'isDeleted', 'creationDate', 'acctions'];
  dataSource = new MatTableDataSource<Farmacia>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _zonasServ:ZonasService,
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllFarmacias()
  }

  getAllFarmacias(){
    let resp = this._zonasServ.getFarmacias()
    resp.subscribe(farmas => {
      console.log(farmas)
      this.dataSource.data = farmas as Farmacia[]
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
    this._dialog.open(DetalleFarmaciaPage, config)
    .afterClosed()
    .subscribe((confirmado:boolean) => {
      if(confirmado){
        this.isLoadingResults = true
        this.getAllFarmacias()
      }
    })
  }

  dialog(farmacia:Farmacia){
    if(!farmacia.isDeleted){
      this._dialog.open(DialogConfComponent, {
        data: `¿Seguro de querer inhabilitar esta farmacia?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          const res = this._zonasServ.deleteFarmacia(farmacia.id!)
          res.subscribe(res => {
            if(res){
              this._zonasServ.notify('Farmacia inhabilidata', 'success')
              this.isLoadingResults = true
              this.getAllFarmacias()
            }
          }, (err => {
            console.log(err)
            this._zonasServ.notify('Ocurrio un error', 'error')
          }))
        }
      })
    }else{
      this._dialog.open(DialogConfComponent, {
        data: `¿Seguro de querer habilitar esta farmacia?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          const res = this._zonasServ.changeStateFarmacia(false, farmacia)
          res.subscribe(res => {
            if(res){
              this._zonasServ.notify('Farmacia restaurada', 'success')
              this.isLoadingResults = true
              this.getAllFarmacias()
            }
          }, (err => {
            console.log(err)
            this._zonasServ.notify('Ocurrio un error', 'error')
          }))
        }
      })
    }
  }
}
