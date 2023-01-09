import { Component, OnInit } from '@angular/core'
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { MedicosService } from 'src/app/services/medicos.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { ZonasService } from 'src/app/services/zonas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  counterPaises?:number
  counterDepartamentos?:number
  counterCiudades?:number
  counterCategorias?:number
  counterProductos?:number
  counterFarmacias?:number
  counterMedicos?:number

  constructor(
    private _zonasServ:ZonasService,
    private _inveServ:InventarioService,
    private _farmaServ:FarmaciasService,
    private _MedicServ:MedicosService
  ){}

  ngOnInit(): void {
    this._zonasServ.getApiToken()
    this._zonasServ.getPaises().subscribe(res =>  {
      this.counterPaises = res.result.length
      this._zonasServ.listPaises = res.result
    })
    this._zonasServ.getDepartamentos().subscribe(res =>  {
      this.counterDepartamentos = res.result.length
      this._zonasServ.listDepartamentos = res.result
    })
    this._zonasServ.getCiudades().subscribe(res =>  {
      this.counterCiudades = res.result.length
      this._zonasServ.listCiudades = res.result
    })
    this._inveServ.getAllCategories().subscribe(res =>  {
      this._inveServ.categorias = res.result
      this.counterCategorias = res.result.length
    })
    this._inveServ.getAllProductos().subscribe(res => this.counterProductos = res.result.length)
    this._farmaServ.getAllPharmacies().subscribe(res => this.counterFarmacias = res.result.length)
    this._MedicServ.getAllMedicos().subscribe(res => this.counterMedicos = res.result.length)
  }
}
