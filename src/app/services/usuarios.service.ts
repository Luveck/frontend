import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private roleList = [];
  private modulesList = [];
  private usersList: any[] = [];
  private usersCombo: any[] = [];
  localRoles: any[] = [];
  usersGlobal: any[] = [];
  headers: any;

  constructor(
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    private readonly errorHandlerService: ErrorHandlerService,

    private _http: HttpClient,
    private _authServ: AuthService,
    private _dataServ: DataService
  ) {
    this._authServ.getCurrentUser();
    this.headers = { Authorization: `Bearer ${this._authServ.userToken}` };
    this.sharedService.getUserDevice();
    this.sharedService.getUserIP();
  }

  public async setUserCombo() {
    try {
      this.usersCombo = await this.apiService.get('User/GetUsersCombo');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando usuarios:'),
        'error'
      );
    }
  }

  public getUserCombo() {
    return this.usersCombo;
  }

  public async setModules() {
    try {
      this.modulesList = await this.apiService.get('Module');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando modulos:'),
        'error'
      );
    }
  }

  public getModules() {
    return this.modulesList;
  }
  public async setRoles() {
    try {
      this.roleList = await this.apiService.get('Role');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando roles:'),
        'error'
      );
    }
  }

  public getRoles() {
    return this.roleList;
  }

  public async setUsers() {
    try {
      this.usersList = await this.apiService.get('User/GetUsersRole');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Listando usuarios por role:'
        ),
        'error'
      );
    }
  }

  public getUsersList() {
    return this.usersList;
  }
  ////////////////////////BORRAR //////////////////////////////////

  notify(msg: string, icon: any) {
    this._dataServ.fir(msg, icon);
  }

  public getUsers() {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get(`${this._dataServ.baseURLSec}Security/GetUsers`, {
      headers: this.headers,
    });
  }

  public getUserInfo(id: string) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get(
      `${this._dataServ.baseURLSec}Security/getUserInfo?infoUser=${id}`,
      { headers: this.headers }
    );
  }

  addUsuario(formData: any) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    console.log(formData);
    let dataUser: any;
    dataUser = {
      ...formData,
      state: true,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
      password: 'SoloInformativo',
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Security/CreateUser`,
      dataUser,
      { headers: this.headers }
    );
  }

  UpdateUsuario(formData: any, state: boolean) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    let dataUser: any;
    dataUser = {
      ...formData,
      state: state,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
      password: 'SoloInformativo',
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Security/UpdateUser`,
      dataUser,
      { headers: this.headers }
    );
  }

  changePassword(formData: any) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    console.log(formData);
    let dataUser: any;
    dataUser = {
      ...formData,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Security/ChangePassword`,
      dataUser,
      { headers: this.headers }
    );
  }

  /* Endpoints de Roles */

  public getAllRoles() {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get<any>(`${this._dataServ.baseURLSec}Roles/GetRoles`, {
      headers: this.headers,
    });
  }

  public getRole(id: string) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get<any>(
      `${this._dataServ.baseURLSec}Roles/GetRole?id=${id}`,
      { headers: this.headers }
    );
  }

  public createRole(nameRole: string) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    let data = {
      RoleId: '',
      roleName: nameRole,
      state: true,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Roles/CreateRole`,
      data,
      { headers: this.headers }
    );
  }

  public updateRole(nameRole: string, idRole: string, state: boolean) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    let data = {
      RoleId: idRole,
      roleName: nameRole,
      state: state,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Roles/UpdateRole`,
      data,
      { headers: this.headers }
    );
  }

  public deletRole(nameRole: string, idRole: string, state: boolean) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    let data = {
      RoleId: idRole,
      roleName: nameRole,
      state: !state,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Roles/DeleteRole`,
      data,
      { headers: this.headers }
    );
  }

  /* Endpoints de modules role */

  public getAllModules() {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get<any>(
      `${this._dataServ.baseURLSec}Module/GetModules`,
      { headers: this.headers }
    );
  }

  public getModulesByRole(idRole: string) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get<any>(
      `${this._dataServ.baseURLSec}ModuleRoles/GetModulesByRole?idRole=${idRole}`,
      { headers: this.headers }
    );
  }

  public updateModuleRole(modules: any, rolId: string) {
    if (!this._authServ.checkTokenDate(this._authServ.expToken)) {
      this._authServ.showSesionEndModal();
      return;
    }
    let data = {
      rolId: rolId,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
      modules: modules,
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}ModuleRoles/UpdateModuleRole`,
      data,
      { headers: this.headers }
    );
  }
}
