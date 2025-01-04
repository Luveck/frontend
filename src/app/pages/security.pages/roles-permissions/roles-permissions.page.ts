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
import { SharedService } from 'src/app/services/shared.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.page.html',
  styleUrls: ['./roles-permissions.page.scss'],
})
export class RolesPermissionsPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de permisos por role',
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
  displayedColumns: string[] = [
    'moduleName',
    'read',
    'create',
    'update',
    'delete',
  ];
  dataSource: any[] = [];

  constructor(
    private readonly _dataServ: DataService,
    private readonly _dialog: MatDialog,
    private readonly usuariosServ: UsuariosService,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getAllRoles();
  }

  private async getAllRoles() {
    try {
      this.isLoadingResults = true;
      await this.usuariosServ.setRoles();
    } catch (error) {
      this.sharedService.notify(
        'Ocurrio un error realizando la consulta.',
        'error'
      );
    } finally {
      this.roles = this.usuariosServ.getRoles();
      this.isLoadingResults = false;
    }
  }

  onRoleSelected() {
    this.getAllPermissionsByrole(this.selected);
  }

  private async getAllPermissionsByrole(roleId: string) {
    try {
      this.isLoadingResults = true;
      this.dataSource = await this.apiService.get(
        `permisos/GetPermissionsByRole?roleId=${roleId}`
      );
    } catch (error) {
      this.sharedService.notify(
        'Ocurrio un error realizando la consulta.',
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
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

  public async onUpdateAccess() {
    const updatePermissions = {
      roleId: this.selected,
      permissions: this.dataSource
        .filter((module) =>
          module.permissions.some((perm: any) =>
            this.isPermissionSelected([perm], perm.permissionName)
          )
        )
        .map((module) => ({
          moduleId: module.moduleId,
          moduleName: module.moduleName,
          permissions: module.permissions.filter((perm: any) =>
            this.isPermissionSelected([perm], perm.permissionName)
          ),
        })),
    };

    console.log(updatePermissions);
    try {
      this.isLoadingResults = true;
      await this.apiService.post(
        `permisos/UpdatePermissions`,
        updatePermissions
      );
      this.sharedService.notify(
        'Accesos actualizados correctamente',
        'success'
      );
    } catch (error) {
      this.sharedService.notify(
        'Ocurrio un error realizando la consulta.',
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  isPermissionSelected(permissions: any[], permissionName: string): boolean {
    return permissions.some(
      (perm) =>
        perm.permissionName.toLowerCase() === permissionName.toLowerCase()
    );
  }

  onCheckboxChange(event: any, moduleId: number, permissionName: string): void {
    const isChecked = event.checked;

    // Encuentra el módulo correspondiente
    const module = this.dataSource.find((mod) => mod.moduleId === moduleId);

    if (module) {
      // Verifica si el permiso ya existe
      const permissionIndex = module.permissions.findIndex(
        (perm: any) =>
          perm.permissionName.toLowerCase() === permissionName.toLowerCase()
      );

      if (isChecked && permissionIndex === -1) {
        // Agregar permiso si no existe y está marcado
        module.permissions.push({
          permissionId: Math.random().toString(36).substr(2, 9), // Generar un ID único
          permissionName: permissionName,
        });
      } else if (!isChecked && permissionIndex !== -1) {
        // Eliminar permiso si existe y se desmarca
        module.permissions.splice(permissionIndex, 1);
      }
    }
  }
}
