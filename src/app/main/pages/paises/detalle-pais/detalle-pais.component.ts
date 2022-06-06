import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router'
import { ZonasService } from 'app/main/services/zonas.service';

@Component({
  selector: 'app-detalle-pais',
  templateUrl: './detalle-pais.component.html',
  styleUrls: ['./detalle-pais.component.scss']
})
export class DetallePaisComponent implements OnInit {
  public contentHeader: object;
  private paisId:string

  constructor(private route: ActivatedRoute, private _zonasServ:ZonasService) { }

  ngOnInit(): void {
    this.paisId = this.route.snapshot.params['id']

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

    if(this.paisId != 'new'){
      this._zonasServ.getPaisById(this.paisId)
      .then(res => {console.log(res)})
      .catch(err => console.log(err))
    }
  }

}
