import { Component, OnInit } from '@angular/core';
import { ZonasService } from 'app/main/services/zonas.service';
import { Subject } from 'rxjs';
import { Ciudad } from '../interfaces';

@Component({
  selector: 'app-list-ciudades',
  templateUrl: './list-ciudades.component.html',
  styleUrls: ['./list-ciudades.component.scss']
})
export class ListCiudadesComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public contentHeader: object;

  rows:Ciudad[]

  constructor(private _zonasServ:ZonasService) { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Ciudades',
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
            name: 'Ciudades',
            isLink: false
          }
        ]
      }
    };

    this._zonasServ.getCiudades()
    .then(res => {console.log(res); this.rows = res})
    .catch(err => console.log(err))
  }

}
