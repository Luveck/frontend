import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientProfileComponent } from './sec/client-profile/client-profile.component';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { SharedService } from 'src/app/services/shared.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  localTheme: boolean = true;
  darkClassName: string = 'theme-dark';
  SectionSelect: string = 'inicio';
  showMenu: boolean = false;
  countryCombo: any[] = [];
  selectedCountry: string = 'hn';
  @HostBinding('class') className = '';

  constructor(
    private _overlay: OverlayContainer,
    private _dialog: MatDialog,
    public dataServ: DataService,

    public authService: AuthService,
    private readonly sharedService: SharedService,
    public readonly sessionService: SessionService
  ) {
    let theme = this.dataServ.getTheme();
    if (theme === 'dark') {
      this.localTheme = false;
      this.className = this.darkClassName;
      this.dataServ.setTheme('dark');
      this._overlay.getContainerElement().classList.add(this.darkClassName);
    } else {
      this.localTheme = true;
      this.className = '';
      this.dataServ.setTheme('light');
      this._overlay.getContainerElement().classList.remove(this.darkClassName);
    }
  }
  ngOnInit(): void {
    this.getInformation();
  }

  private checkUserRegistration(): void {
    if (this.sessionService.getToken()) {
      this.selectedCountry = this.countryCombo.find(
        (c) => c.id === Number(this.sessionService.getUserData().countryId)
      )?.iso3;
      this.changeCountry();
    }
  }
  setTheme() {
    this.localTheme = !this.localTheme;
    if (!this.localTheme) {
      this.localTheme = false;
      this.className = this.darkClassName;
      this.dataServ.setTheme('dark');
      this._overlay.getContainerElement().classList.add(this.darkClassName);
    } else {
      this.localTheme = true;
      this.className = '';
      this.dataServ.setTheme('light');
      this._overlay.getContainerElement().classList.remove(this.darkClassName);
    }
  }

  selectSection(sec: string) {
    this.SectionSelect = sec;
    this.showMenu = false;
  }

  showProfile() {
    const config: MatDialogConfig = {
      data: this.sessionService.getUserData().UserId,
    };
    this._dialog.open(ClientProfileComponent, config);
  }

  onLogout() {
    this._dialog
      .open(DialogConfComponent, {
        data: `¿Seguro de querer Cerrar la sesión?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.SectionSelect = 'inicio';
          this.authService.logOut();
        }
      });
  }

  onLogin() {
    this.dataServ.goTo('/authentication/login');
  }

  private async getInformation() {
    try {
      await this.sharedService.setCountryCombo();
    } catch (error) {
    } finally {
      this.countryCombo = this.sharedService.getCountryCombo();
      this.selectedCountry = this.countryCombo.find(
        (c) => c.iso3 === this.dataServ.getCountry()
      ).iso3;
      this.checkUserRegistration();
    }
  }

  public getFlag(flag: string) {
    return `https://flagcdn.com/${flag.toLowerCase()}.svg`;
  }

  public changeCountry() {
    this.dataServ.setCountry(
      this.countryCombo.find((c) => c.iso3 === this.selectedCountry)
    );
  }
}
