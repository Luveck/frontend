import { Component, OnInit } from '@angular/core';
import { ZonasService } from 'app/main/services/zonas.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Departamento } from '../interfaces';

@Component({
  selector: 'app-list-departamentos',
  templateUrl: './list-departamentos.component.html',
  styleUrls: ['./list-departamentos.component.scss']
})
export class ListDepartamentosComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public contentHeader: object;

  rows:Departamento[]

  constructor(private _zonasServ:ZonasService ) { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Departamentos',
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
            name: 'Departamentos',
            isLink: false
          }
        ]
      }
    };

    this._zonasServ.getDepartamentos()
      .then(res => {console.log(res); this.rows = res})
      .catch(err => console.log(err))
  }

}
