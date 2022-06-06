import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ZonasService } from 'app/main/services/zonas.service';
import { Pais } from '../interfaces';

@Component({
  selector: 'app-list-paises',
  templateUrl: './list-paises.component.html',
  styleUrls: ['./list-paises.component.scss']
})
export class ListPaisesComponent implements OnInit {
  // public
  private _unsubscribeAll: Subject<any>;
  public contentHeader: object;

  public ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  constructor(public zonasServ:ZonasService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // content header
    this.contentHeader = {
      headerTitle: 'Paises',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/'
          },
          {
            name: 'Gestión de paises',
            isLink: true,
            link: '/'
          },
          {
            name: 'Paises',
            isLink: false
          }
        ]
      }
    };

    if(!this.zonasServ.listCountries){
      this.zonasServ.getPaises()
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
