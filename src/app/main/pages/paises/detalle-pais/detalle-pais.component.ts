import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-pais',
  templateUrl: './detalle-pais.component.html',
  styleUrls: ['./detalle-pais.component.scss']
})
export class DetallePaisComponent implements OnInit {
  public contentHeader: object;

  constructor() { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Detalle País',
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
            isLink: true,
            link: '/pages/zona/listpaises'
          },
          {
            name: 'Detalle País',
            isLink: false
          }
        ]
      }
    };
  }

}
