import { AfterViewInit, Component } from '@angular/core';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { MedicosService } from 'src/app/services/medicos.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { RulesService } from 'src/app/services/rules.service';
import { VentasService } from 'src/app/services/ventas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-panel-control',
  templateUrl: './panel-control.page.html',
  styleUrls: ['./panel-control.page.scss'],
})
export class PanelControlPage implements AfterViewInit {
  counterVentas?: number;
  counterProductos?: number;
  counterRules?: number;
  counterFarmacias?: number;
  counterUsers?: number;
  counterMedicos?: number;
  counterPaises?: number;
  counterDepartamentos?: number;
  counterCiudades?: number;
  counterCadena?: number;

  constructor(
    private readonly sharedService: SharedService,
    private readonly inveServ: InventarioService,
    private readonly farmaServ: FarmaciasService,
    private readonly medicServ: MedicosService,
    private readonly usersServ: UsuariosService,
    private readonly rulesServ: RulesService,
    private readonly ventasServ: VentasService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService
  ) {}

  viewInfoPanel(module: string) {
    if (this.authService.hasPermission(module)) {
      return true;
    }
    return false;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (
        this.authService.checkTokenDate(this.sessionService.getExpToken()) &&
        this.sessionService.getToken()
      ) {
        this.getData();
      }
    }, 500);
  }

  public async getData() {
    if (this.authService.hasPermission('Paises')) {
      await this.sharedService.setCountry();
      this.counterPaises = this.sharedService.getCountryList().length;
    }

    if (this.authService.hasPermission('Departamentos')) {
      await this.sharedService.setDepartments();
      this.counterDepartamentos = this.sharedService.getDepartmentList().length;
    }

    if (this.authService.hasPermission('Ciudades')) {
      await this.sharedService.setCities();
      this.counterCiudades = this.sharedService.getCityList().length;
    }

    if (this.authService.hasPermission('Productos')) {
      await this.inveServ.setProducts();
      this.counterProductos = this.inveServ.getProducts().length;
    }

    if (this.authService.hasPermission('Farmacias')) {
      await this.farmaServ.setPharmacies();
      this.counterFarmacias = this.farmaServ.getPharmacies().length;
    }

    if (this.authService.hasPermission('Medicos')) {
      await this.medicServ.setMedicos();
      this.counterMedicos = this.medicServ.getMedicos().length;
    }

    if (this.authService.hasPermission('Usuarios')) {
      await this.usersServ.setUsers();
      this.counterUsers = this.usersServ.getUsersList().length;
    }

    if (this.authService.hasPermission('Reglas-Canje')) {
      await this.rulesServ.setRules();
      this.counterRules = this.rulesServ.getRules().length;
    }
    if (this.authService.hasPermission('Registro-ventas')) {
      await this.ventasServ.setPurchase();
      this.counterVentas = this.ventasServ.getPurchases().length;
    }
  }
}
