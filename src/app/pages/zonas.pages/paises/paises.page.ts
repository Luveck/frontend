import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Pais } from 'src/app/interfaces/models';

import { DataService } from 'src/app/services/data.service';
import { ZonasService } from 'src/app/services/zonas.service';

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
        link: '/'
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
  displayedColumns: string[] = ['name', 'currency', 'phoneCode', 'status', 'creationDate', 'acctions'];
  dataSource = new MatTableDataSource<Pais>(this.ELEMENT_DATA);

  resultsLength = 0;
  isLoadingResults:boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _zonasServ:ZonasService,
    private _dataServ:DataService
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllCountries()
  }

  getAllCountries() {
    let resp = this._zonasServ.getPaises()
    resp.subscribe(paises => {
      this.dataSource.data = paises as Pais[]
      this.isLoadingResults = false
      console.log(this.dataSource.data)
    }, (err => console.log(err)))
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

  on(id:string){
    this._dataServ.goTo('admin/zonas/detalle-pais', id)
  }

  dialog(id: number, estado: boolean) {
    let paisEnCuestion = this.dataSource.data.filter(pais => pais.id === id)
    let msg = estado ? '¿Seguro de querer inhabilitar este pais?' : '¿Seguro de querer habilitar este pais?'

    this._dialog.open(DialogConfComponent, {
      data: `${msg}`
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          paisEnCuestion[0].status = !paisEnCuestion[0].status
          let respuesta = this._zonasServ.addOrUpdatePais(paisEnCuestion[0])
          respuesta.subscribe(() => {
            this._dataServ.fir('Registro actualizado', 'success')
          })
        }
      })
  }
}
