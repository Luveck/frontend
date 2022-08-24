import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ciudad } from 'src/app/interfaces/models';

import { DataService } from 'src/app/services/data.service';
import { ZonasService } from 'src/app/services/zonas.service';

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
        link: '/'
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
  displayedColumns:string[] = ['name', 'stateCode', 'createBy', 'creationDate', 'updateBy', 'updateDate'];
  dataSource = new MatTableDataSource<Ciudad>(this.ELEMENT_DATA);

  resultsLength = 0;
  isLoadingResults:boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _zonasServ:ZonasService,
    private _dataServ:DataService
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllCities()
  }

  getAllCities() {
    let resp = this._zonasServ.getCiudades()
    resp.subscribe(paises => {
      this.dataSource.data = paises as Ciudad[]
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
    this._dataServ.goTo('admin/zonas/detalle-ciudad', id)
  }
}
