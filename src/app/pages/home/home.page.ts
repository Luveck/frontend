import { AfterViewInit, Component } from '@angular/core'
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { MedicosService } from 'src/app/services/medicos.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { RulesService } from 'src/app/services/rules.service';
import { VentasService } from 'src/app/services/ventas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements AfterViewInit {
  counterVentas?:number
  counterProductos?:number
  counterRules?:number
  counterFarmacias?:number
  counterUsers?:number
  counterMedicos?:number
  counterPaises?:number
  counterDepartamentos?:number
  counterCiudades?:number

  constructor(
    private _zonasServ:ZonasService,
    private _inveServ:InventarioService,
    private _farmaServ:FarmaciasService,
    private _MedicServ:MedicosService,
    private _rulesServ:RulesService,
    private _ventasServ:VentasService,
    private _usersServ:UsuariosService,
    private _authServ:AuthService
  ){}

  ngAfterViewInit(): void {
    if(this._authServ.checkTokenDate(this._authServ.expToken) && this._authServ.userToken){
      this._ventasServ.getVentas().subscribe(res => this.counterVentas = res.result.length)

      this._inveServ.getProductos().subscribe(res => {
        this.counterProductos = res.result.length
        this._inveServ.listProducts = res.result
      })

      this._rulesServ.getRules().subscribe(res => this.counterRules = res.result.length)

      this._farmaServ.getFarmacias().subscribe(res => {
        this.counterFarmacias = res.result.length
        this._farmaServ.listFarmacias = res.result
      })

      this._usersServ.getUsers().subscribe((res:any) => this.counterUsers = res.result.length)

      this._MedicServ.getMedicos().subscribe(res => this.counterMedicos = res.result.length)

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
    }
  }
}
