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

export class HomePage {

  public name : string = '';

  constructor(
    private _authServ:AuthService
  ){
    this.name = _authServ.dataUser().UserName + ' ' + _authServ.dataUser().LastName;
  }
}
