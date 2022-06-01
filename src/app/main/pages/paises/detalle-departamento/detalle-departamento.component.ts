import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-departamento',
  templateUrl: './detalle-departamento.component.html',
  styleUrls: ['./detalle-departamento.component.scss']
})
export class DetalleDepartamentoComponent implements OnInit {
  public contentHeader: object;

  constructor() { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Detalle Departamento',
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
            isLink: true,
            link: '/pages/zona/listdepartamentos'
          },
          {
            name: 'Detalle Departamento',
            isLink: false
          }
        ]
      }
    };
  }

}
