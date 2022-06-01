import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-ciudad',
  templateUrl: './detalle-ciudad.component.html',
  styleUrls: ['./detalle-ciudad.component.scss']
})
export class DetalleCiudadComponent implements OnInit {
  public contentHeader: object;

  constructor() { }

  ngOnInit(): void {
    // content header
    this.contentHeader = {
      headerTitle: 'Detalle Ciudad',
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
            isLink: true,
            link: '/pages/zona/listciudades'
          },
          {
            name: 'Detalle Ciudad',
            isLink: false
          }
        ]
      }
    };
  }

}
