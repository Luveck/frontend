import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-departamentos',
  templateUrl: './list-departamentos.component.html',
  styleUrls: ['./list-departamentos.component.scss']
})
export class ListDepartamentosComponent implements OnInit {
  public contentHeader: object;

  constructor() { }

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
  }

}
