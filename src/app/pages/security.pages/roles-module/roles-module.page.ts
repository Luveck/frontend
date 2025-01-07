import { Component, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  Module,
  ModuleRole,
  Role,
  RoleModule,
} from 'src/app/interfaces/models';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-roles-module',
  templateUrl: './roles-module.page.html',
  styleUrls: ['./roles-module.page.scss'],
})
export class RolesModulePage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de modulos por role',
        isLink: false,
      },
    ],
  };

  selected = '';
  isLoadingResults: boolean = true;
  roles: any[] = [];
  modules: any[] = [];
  modulesRole: RoleModule[] = [];
  @Input('ELEMENT_DATA') ELEMENT_DATA!: ModuleRole[];
  displayedColumns: string[] = ['name', 'access'];
  dataSource = new MatTableDataSource<ModuleRole>(this.ELEMENT_DATA);

  constructor(
    private readonly _dataServ: DataService,
    private readonly _dialog: MatDialog,
    private readonly usuariosServ: UsuariosService,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getAllRoles();
    this.getAllModules();
  }

  private async getAllRoles() {
    this.isLoadingResults = true;
    await this.usuariosServ.setRoles();
    this.roles = this.usuariosServ.getRoles();
    this.isLoadingResults = false;
  }

  onRoleSelected() {
    this.getAllModulesById(this.selected);
  }

  modulesToLoad(): ModuleRole[] {
    const listModule: ModuleRole[] = [];
    this.modules.forEach((module) => {
      const foundItem = this.modulesRole.filter(
        (x) => x.moduleId.toString() == module.id
      );
      const selected = Object.keys(foundItem).length !== 0;
      listModule.push({ ...module, selected });
    });
    return listModule;
  }

  private async getAllModulesById(id: string) {
    try {
      this.modulesRole = await this.apiService.get(`ModuleRole/ByRole/${id}`);
      this.dataSource.data = this.modulesToLoad();
    } catch (error) {
      this.sharedService.notify(
        'Ocurrio un error realizando la consulta.',
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  private async getAllModules() {
    try {
      this.isLoadingResults = true;
      await this.usuariosServ.setModules();
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando roles:'),
        'error'
      );
    } finally {
      this.modules = this.usuariosServ.getModules();
      this.isLoadingResults = false;
    }
  }

  onUpdateAccess() {
    const modulesAccess: any = [];
    this.dataSource.data.forEach((element) => {
      if (element.selected) modulesAccess.push(element.id);
    });
    const res = this.usuariosServ.updateModuleRole(
      modulesAccess,
      this.selected
    );
    res?.subscribe(
      (res) => {
        if (res) {
          this.usuariosServ.notify('Accesos actualizados', 'success');
          this.isLoadingResults = true;
          this.getAllRoles();
          this.dataSource.data = [];
          this.selected = '';
        }
      },
      (err) => {
        this.getAllRoles();
        this.usuariosServ.notify('Ocurrio un error con el proceso.', 'error');
      }
    );
  }

  onCheckboxChange(event: MatCheckboxChange, roleId: string) {
    const updatedDataSource = this.dataSource.data.map((item) => {
      if (item.id === roleId) {
        item.selected = event.checked;
      }
      return item;
    });
    this.dataSource.data = updatedDataSource;
  }
}
