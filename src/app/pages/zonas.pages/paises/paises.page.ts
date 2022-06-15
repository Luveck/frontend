import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Pais } from 'src/app/interfaces/zonas.model';

import { ZonasService } from 'src/app/services/zonas.service';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.page.html',
  styleUrls: ['./paises.page.scss'],
})

export class PaisesPage implements AfterViewInit {
  @Input('ELEMENT_DATA')  ELEMENT_DATA!:Pais[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns: string[] = ['name', 'currency', 'phoneCode', 'status', 'creationDate', 'acctions'];
  dataSource = new MatTableDataSource<Pais>(this.ELEMENT_DATA);

  resultsLength = 0;
  isLoadingResults:boolean = true;

  constructor(private _liveAnnouncer: LiveAnnouncer, private _zonasServ:ZonasService, private _router:Router){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllCountries()
  }

  getAllCountries() {
    let resp = this._zonasServ.getPaises()
    resp.subscribe(paises => {
      console.log(paises)
      this.dataSource.data = paises as Pais[]
      this.isLoadingResults = false
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

  on(data:any){
    console.log(data)
  }

  dialog(data:any){
    console.log(data)
  }
}
