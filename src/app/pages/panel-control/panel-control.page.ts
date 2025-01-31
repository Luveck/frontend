import { AfterViewInit, Component } from '@angular/core';
import { FarmaciasService } from 'src/app/services/farmacias.service';
import { MedicosService } from 'src/app/services/medicos.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { RulesService } from 'src/app/services/rules.service';
import { VentasService } from 'src/app/services/ventas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { CadenaService } from 'src/app/services/cadenas.service';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

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
    private _zonasServ: ZonasService,

    private _authServ: AuthService,

    // Revisar si con esto funciona y borar lo otro
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    private readonly inveServ: InventarioService,
    private readonly farmaServ: FarmaciasService,
    private readonly medicServ: MedicosService,
    private readonly usersServ: UsuariosService,
    private readonly rulesServ: RulesService,
    private readonly ventasServ: VentasService
  ) {}

  viewInfoPanel(module: string) {
    if (this._authServ.hasPermission(module)) {
      return true;
    }
    return false;
  }
  ngAfterViewInit(): void {
    this.getData();
    setTimeout(() => {
      if (
        this._authServ.checkTokenDate(this._authServ.expToken) &&
        this._authServ.userToken
      ) {
      }
    }, 2000);
  }

  public async getData() {
    if (this._authServ.hasPermission('Paises')) {
      await this.sharedService.setCountry();
      this.counterPaises = this.sharedService.getCountryList().length;
    }

    if (this._authServ.hasPermission('Departamentos')) {
      await this.sharedService.setDepartments();
      this.counterDepartamentos = this.sharedService.getDepartmentList().length;
    }

    if (this._authServ.hasPermission('Ciudades')) {
      await this.sharedService.setCities();
      this.counterCiudades = this.sharedService.getCityList().length;
    }

    if (this._authServ.hasPermission('Productos')) {
      await this.inveServ.setProducts();
      this.counterProductos = this.inveServ.getProducts().length;
    }

    if (this._authServ.hasPermission('Farmacias')) {
      await this.farmaServ.setPharmacies();
      this.counterFarmacias = this.farmaServ.getPharmacies().length;
    }

    if (this._authServ.hasPermission('Medicos')) {
      await this.medicServ.setMedicos();
      this.counterMedicos = this.medicServ.getMedicos().length;
    }

    if (this._authServ.hasPermission('Usuarios')) {
      await this.usersServ.setUsers();
      this.counterUsers = this.usersServ.getUsersList().length;
    }

    if (this._authServ.hasPermission('Reglas-Canje')) {
      await this.rulesServ.setRules();
      this.counterRules = this.rulesServ.getRules().length;
    }
    if (this._authServ.hasPermission('Registro-ventas')) {
      await this.ventasServ.setPurchase();
      this.counterVentas = this.ventasServ.getPurchases().length;
    }
  }
}
