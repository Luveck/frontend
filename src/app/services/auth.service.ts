import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataService } from './data.service';
import { SesionEndComponent } from '../components/sesion-end/sesion-end.component';
import { SharedService } from './shared.service';
import { UserRoles } from '../shared/enums/roles.enum';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userPermissions: string[] = [];

  constructor(
    private _dataServ: DataService,
    private _http: HttpClient,
    private _dialog: MatDialog,

    private readonly dataService: DataService,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sessionService: SessionService
  ) {
    this.getPermissions();
  }

  public async login(formData: any) {
    try {
      const dataLogin = {
        ...formData,
      };
      const login = (await this.apiService.post(
        'user/login',
        dataLogin
      )) as any;
      this.updateDataLogin(login);
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Login failed');
      console.log(error);
    }
  }

  private updateDataLogin(responseLogin: any) {
    this.sessionService.setToken(responseLogin['token'].token);
    this.setPermissions(responseLogin['moduleRoleResponse']);
    this.sessionService.setUserData(responseLogin['pharmacyId']);
    this.sessionService.setExpToken(responseLogin['token'].expiration);
    if (responseLogin['changePass']) {
      this.dataService.goTo('/authentication/changepassword');
    } else {
      this.redirectSegunDate(this.sessionService.getExpToken());
    }
  }

  tokenExpirationCheck(exp: string): boolean {
    let dateToken = new Date(exp);
    let dateNow = new Date();
    if (dateNow >= dateToken) {
      return false;
    } else {
      return true;
    }
  }

  public logOut() {
    let role = this.sessionService.getUserData().Role;
    this.sessionService.clearSession();
    localStorage.removeItem('LuveckUserMenu');
    role === 'Admin'
      ? this.dataService.goTo('/authentication/login')
      : this.dataService.goTo('/inicio');
  }

  /////////////////////////////

  setPermissions(permissions: string[]) {
    localStorage.setItem('userPermissions', JSON.stringify(permissions));
    this.userPermissions = permissions;
  }

  getPermissions() {
    const permissions = localStorage.getItem('userPermissions');
    if (permissions) {
      this.userPermissions = JSON.parse(permissions);
    }
    return this.userPermissions;
  }

  hasPermission(moduleName: string): boolean {
    var pass = localStorage.getItem('userPermissions')?.includes(moduleName);
    return pass == true;
  }

  public async logind(formData: any) {
    let info = {
      dni: formData.dni,
      password: formData.password,
    };
    return this._http
      .post(`${this._dataServ.baseURLSec}Security/Login`, info)
      .toPromise();
  }

  public async register(formData: any) {
    formData['idRole'] = '';
    formData['role'] = '';
    return this._http
      .post(`${this._dataServ.baseURLSec}Security/Register`, formData)
      .toPromise();
  }

  public async forgotPass(data: any) {
    let info = {
      emailDni: data.dni,
    };

    return this._http
      .post(`${this._dataServ.baseURLSec}Security/Forgot`, info)
      .toPromise();
  }

  public resetPass(formData: any) {
    let info = {
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
      EmailDNI: formData.email,
      code: formData.code,
    };
    return this._http
      .post(`${this._dataServ.baseURLSec}Security/Reset`, info)
      .toPromise();
  }
  // no borrar
  // public decodeToken(token: string, changePass?: boolean) {
  //   try {
  //     if (!token || token.split('.').length !== 3) {
  //       throw new Error('El token no tiene un formato válido.');
  //     }

  //     const base64Url = token.split('.')[1];
  //     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //     const jsonPayload = decodeURIComponent(
  //       atob(base64)
  //         .split('')
  //         .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
  //         .join('')
  //     );

  //     const tokenData = JSON.parse(jsonPayload);

  //     // Validar las propiedades necesarias
  //     if (!tokenData.UserId || !tokenData.UserName || !tokenData.exp) {
  //       throw new Error('El token no contiene las propiedades requeridas.');
  //     }

  //     this.userData = {
  //       UserId: tokenData.UserId,
  //       UserName: tokenData.UserName,
  //       LastName: tokenData.LastName || '', // Valores opcionales
  //       Role: tokenData.Role || '',
  //       Email: tokenData.Email || '',
  //       countryId: tokenData.CountryId || '',
  //       pharmacyId: tokenData.PharmacyId || '',
  //     };

  //     this.expToken = tokenData.exp;

  //     if (changePass) {
  //       this._dataServ.goTo('/authentication/changepassword');
  //     } else {
  //       this.redirectSegunDate(this.expToken);
  //     }
  //   } catch (error) {
  //     console.error('Error al decodificar el token:', error);
  //     this.logOut(); // Opcional: cerrar sesión en caso de token inválido
  //   }
  // }

  redirectSegunDate(exp: any) {
    if (this.checkTokenDate(exp)) {
      if (
        this.sessionService.getUserData().Role != UserRoles.Cliente.toString()
      ) {
        this._dataServ.goTo('/admin/panelControl');
      } else {
        this._dataServ.goTo('/inicio');
      }
    } else {
      this.showSesionEndModal();
    }
  }

  checkTokenDate(exp: number): boolean {
    let dateToken = new Date(exp * 1000);
    let dateNow = new Date();
    if (dateNow >= dateToken) {
      return false;
    } else {
      return true;
    }
  }

  showSesionEndModal() {
    const config: MatDialogConfig = {
      disableClose: true,
    };
    this._dialog
      .open(SesionEndComponent, config)
      .afterClosed()
      .subscribe(() => {
        this._dialog.closeAll();
        this.logOut();
      });
  }
}
