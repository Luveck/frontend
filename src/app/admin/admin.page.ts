import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { elementAt, Observable } from 'rxjs';

import { fadeAnimation } from '../animations';
import { DialogConfComponent } from '../components/dialog-conf/dialog-conf.component';
import { ClientProfileComponent } from '../pages/inicio/sec/client-profile/client-profile.component';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { environment } from 'src/environments/environment';
import { SharedService } from '../services/shared.service';
import { UserRoles } from '../shared/enums/roles.enum';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  animations: [fadeAnimation],
})
export class AdminPage implements OnInit {
  img: String = 'assets/icons/user.png';
  menuList = environment.menu;
  localTheme: boolean = true;
  darkClassName: string = 'theme-dark';
  countryCombo : any[] = [];
  selectedCountry : string = 'hn';
  isAdmin : boolean = false;

  @HostBinding('class') className = '';

  constructor(
    private _http: HttpClient,
    private _overlay: OverlayContainer,
    private _dialogo: MatDialog,
    private _dataServ: DataService,
    public authServ: AuthService,
    public dataServ: DataService,
    private readonly sharedService:SharedService
  ) {
    let theme = this._dataServ.getTheme();
    if (theme === 'dark') {
      this.localTheme = false;
      this.className = this.darkClassName;
      this._dataServ.setTheme('dark');
      this._overlay.getContainerElement().classList.add(this.darkClassName);
    } else {
      this.localTheme = true;
      this.className = '';
      this._dataServ.setTheme('light');
      this._overlay.getContainerElement().classList.remove(this.darkClassName);
    }

    this.updateMenu(this.menuList, this.authServ.getPermissions());

  }

  // Función para actualizar el menú
  updateMenu(menu: any[], moduleRoleResponse: any[]) {
    var start = true;
    menu.forEach((menuItem) => {
      const hasAccess = moduleRoleResponse.some(
        (role) => role.moduleName === menuItem.module
      );
      menuItem.enabled = hasAccess;

      if (start) {
        start = false
        if(!moduleRoleResponse.some((role) => role.moduleName == 'PanelControl') ) {
          menuItem.enabled = true;
        }
      }

      if (menuItem.children && menuItem.children.length > 0) {
        menuItem.children.forEach((childItem: any) => {
          const childHasAccess = moduleRoleResponse.some(
            (role) => role.moduleName === childItem.module
          );
          childItem.enabled = childHasAccess;
        });

        const parentHasNoAccessButChildHas =
          !hasAccess && menuItem.children.some((child: any) => child.enabled);
        if (parentHasNoAccessButChildHas) {
          menuItem.enabled = true;
        }
      }
    });
    var newMenu: any = [];
    menu.forEach((element) => {
      if (element.enabled) {
        if (element.children != undefined) {
          var subMenu:any = []
          element.children.forEach((item : any) => {
            if (item.enabled) {
              subMenu.push(item);
            }
          });
          element.children = subMenu;
        }
        newMenu.push(element)
      }
    });
    this.menuList = newMenu;
  }

  isMenuEnabled(menu: any): boolean {
    return (
      menu.enabled ||
      (menu.children && menu.children.some((child: any) => child.enabled))
    );
  }

  fadeIn(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  ngOnInit(): void {
    this.getInformation();
  }

  private async getInformation() {
    try {
      await this.sharedService.setCountryCombo()
    } catch (error) {

    } finally {
      this.countryCombo = this.sharedService.getCountryCombo();
      this.countryCombo = this.sharedService.getCountryCombo();
      this.selectedCountry = this.countryCombo.find(c => c.iso3 === this.dataServ.getCountry()).iso3;
      this.isAdmin = this.authServ.dataUser().Role === UserRoles.Admin.toString();
    }
  }

  onLogout() {
    this._dialogo
      .open(DialogConfComponent, {
        data: `¿Seguro de querer Cerrar la sesión?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.authServ.logOut(this.authServ.dataUser().Role);
        }
      });
  }

  setTheme() {
    this.localTheme = !this.localTheme;
    if (!this.localTheme) {
      this.localTheme = false;
      this.className = this.darkClassName;
      this._dataServ.setTheme('dark');
      this._overlay.getContainerElement().classList.add(this.darkClassName);
    } else {
      this.localTheme = true;
      this.className = '';
      this._dataServ.setTheme('light');
      this._overlay.getContainerElement().classList.remove(this.darkClassName);
    }
  }

  openProfile() {
    const config = {
      data: this.authServ.dataUser().UserId,
    };
    this._dialogo.open(ClientProfileComponent, config);
  }

  public changeCountry() {
    this.dataServ.setCountry(this.countryCombo.find(c => c.iso3 ===this.selectedCountry));
  }

  public getFlag(flag: string) {
    return `https://flagcdn.com/${flag.toLowerCase()}.svg`
  }
}
