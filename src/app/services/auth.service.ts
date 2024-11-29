import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataService } from './data.service';
import { SesionEndComponent } from '../components/sesion-end/sesion-end.component';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userToken: any = null;
  private userData: DataUser = {} as DataUser;
  expToken: number | any = null;
  private userPermissions: string[] = [];

  constructor(
    private _dataServ: DataService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    private sharedService: SharedService
  ) {
    this.getPermissions();
    this.getCurrentUser();
  }

  public dataUser() {
    return this.userData;
  }
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

  getCurrentUser() {
    const tokentUser = localStorage.getItem('LuveckUserToken');
    if (tokentUser) {
      this.userToken = tokentUser;
      this.decodeToken(this.userToken);
    }
  }

  public async login(formData: any) {
    let info = {
      dni: formData.dni,
      password: formData.password,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
    };
    return this._http
      .post(`${this._dataServ.baseURLSec}Security/Login`, info)
      .toPromise();
  }

  public async register(formData: any) {
    formData['ip'] = this.sharedService.userIP;
    formData['device'] = this.sharedService.userDevice;
    formData['idRole'] = '';
    formData['role'] = '';
    return this._http
      .post(`${this._dataServ.baseURLSec}Security/Register`, formData)
      .toPromise();
  }

  public async forgotPass(data: any) {
    let info = {
      emailDni: data.dni,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
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
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
    };
    return this._http
      .post(`${this._dataServ.baseURLSec}Security/Reset`, info)
      .toPromise();
  }
// no borrar
  public decodeToken(token: string, changePass?: boolean) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    let tokenData = JSON.parse(jsonPayload);
    this.userData = {
      UserId: tokenData.UserId,
      UserName: tokenData.UserName,
      LastName: tokenData.LastName,
      Role: tokenData.Role,
      Email: tokenData.Email,
    };
    this.expToken = tokenData.exp;
    if (changePass === true) {
      this._dataServ.goTo('/authentication/changepassword');
    } else {
      this.redirectSegunDate(this.expToken);
    }
  }

  redirectSegunDate(exp: any) {
    if (this.checkTokenDate(exp)) {
      if (this.userData.Role != 'Cliente') {
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

  public logOut(role: string) {
    this.userToken = null;
    this.userData = {} as DataUser;;
    localStorage.removeItem('LuveckUserToken');
    localStorage.removeItem('LuveckUserMenu');
    role === 'Admin'
      ? this._dataServ.goTo('/authentication/login')
      : this._dataServ.goTo('/inicio');
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
        this.logOut(this.userData.Role);
      });
  }
}

export interface DataUser {
  UserId: string;
  UserName: string;
  LastName: string;
  Role: string;
  Email: string;
}
