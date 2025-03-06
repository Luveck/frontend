import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';
import { SessionService } from './session.service';

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
    private _dataServ: DataService,
    private readonly sessionService: SessionService
  ) {}

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

  public async setUserComboByCountry(countryId: string) {
    try {
      this.usersCombo = await this.apiService.get(
        'User/GetUsersComboByCountry' + countryId
      );
      return this.usersCombo;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Listando usuarios:'),
        'error'
      );
      return [];
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

  public async getRoleById(id: string) {
    try {
      return await this.apiService.get(`Role/GetByIdAsync/${id}`);
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Consultando roles:'),
        'error'
      );
      return null;
    }
  }

  public async addRole(role: string) {
    try {
      await this.apiService.post(`Role?name=${role}`, {});
      this.sharedService.notify('Role registrado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Creando roles:'),
        'error'
      );
    }
  }

  public async updateRole(role: string, id: string) {
    try {
      await this.apiService.put(`Role?id=${id}&name=${role}`, {});
      this.sharedService.notify('Role actualizado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando roles:'),
        'error'
      );
    }
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

  public async setUsersByCountry(countryId: string) {
    try {
      this.usersList = await this.apiService.get(
        'User/GetUsersRole/' + countryId
      );
      return this.usersList;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Listando usuarios por role:'
        ),
        'error'
      );
      return [];
    }
  }

  public getUsersList() {
    return this.usersList;
  }

  public async updateModulesByRole(modules: any, rolId: string) {
    try {
      let data = {
        RoleId: rolId,
        modules: modules,
      };

      const response = await this.apiService.post(
        'ModuleRole/UpdateModulesByRole',
        data
      );

      this.sharedService.notify('Modulos actualizados para el Role', 'success');
      return response;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Actualizando los modulos por rol:'
        ),
        'error'
      );
    }
  }

  public async registerUser(dataUser: any) {
    try {
      return await this.apiService.post('User/RegisterUser', dataUser);
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Registrando usuario:'),
        'error'
      );
      return;
    }
  }

  ////////////////////////BORRAR //////////////////////////////////

  notify(msg: string, icon: any) {
    this._dataServ.fir(msg, icon);
  }

  public getUsers() {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get(`${this._dataServ.baseURLSec}Security/GetUsers`, {
      headers: this.headers,
    });
  }

  addUsuario(formData: any) {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    console.log(formData);
    let dataUser: any;
    dataUser = {
      ...formData,
      state: true,
      password: 'SoloInformativo',
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Security/CreateUser`,
      dataUser,
      { headers: this.headers }
    );
  }

  UpdateUsuario(formData: any, state: boolean) {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    let dataUser: any;
    dataUser = {
      ...formData,
      state: state,
      password: 'SoloInformativo',
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Security/UpdateUser`,
      dataUser,
      { headers: this.headers }
    );
  }

  changePassword(formData: any) {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    console.log(formData);
    let dataUser: any;
    dataUser = {
      ...formData,
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Security/ChangePassword`,
      dataUser,
      { headers: this.headers }
    );
  }

  /* Endpoints de Roles */

  public getAllRoles() {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get<any>(`${this._dataServ.baseURLSec}Roles/GetRoles`, {
      headers: this.headers,
    });
  }

  public getRole(id: string) {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get<any>(
      `${this._dataServ.baseURLSec}Roles/GetRole?id=${id}`,
      { headers: this.headers }
    );
  }

  public createRole(nameRole: string) {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    let data = {
      RoleId: '',
      roleName: nameRole,
      state: true,
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Roles/CreateRole`,
      data,
      { headers: this.headers }
    );
  }

  public deletRole(nameRole: string, idRole: string, state: boolean) {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    let data = {
      RoleId: idRole,
      roleName: nameRole,
      state: !state,
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}Roles/DeleteRole`,
      data,
      { headers: this.headers }
    );
  }

  /* Endpoints de modules role */

  public getAllModules() {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get<any>(
      `${this._dataServ.baseURLSec}Module/GetModules`,
      { headers: this.headers }
    );
  }

  public getModulesByRole(idRole: string) {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    return this._http.get<any>(
      `${this._dataServ.baseURLSec}ModuleRoles/GetModulesByRole?idRole=${idRole}`,
      { headers: this.headers }
    );
  }

  public updateModuleRole(modules: any, rolId: string) {
    if (!this._authServ.checkTokenDate(this.sessionService.getExpToken())) {
      this._authServ.showSesionEndModal();
      return;
    }
    let data = {
      rolId: rolId,
      modules: modules,
    };
    return this._http.post(
      `${this._dataServ.baseURLSec}ModuleRoles/UpdateModuleRole`,
      data,
      { headers: this.headers }
    );
  }
}
