import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-ciudades',
  templateUrl: './list-ciudades.component.html',
  styleUrls: ['./list-ciudades.component.scss']
})
export class ListCiudadesComponent implements OnInit {
  public contentHeader: object;

  constructor() { }

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
  }

}
