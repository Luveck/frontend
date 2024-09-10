import { Component, Input, OnInit } from '@angular/core'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Module, ModuleRole, Role, RoleModule } from 'src/app/interfaces/models';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-roles-module',
  templateUrl: './roles-module.page.html',
  styleUrls: ['./roles-module.page.scss'],
})

export class RolesModulePage implements OnInit{
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de modulos por role',
        isLink: false,
      }
    ]
  }

  selected = '';
  isLoadingResults:boolean = true;
  roles : Role[] = [];
  modules : Module[] = [];
  modulesRole : RoleModule[] = [];
  @Input('ELEMENT_DATA')  ELEMENT_DATA!:ModuleRole[];
  displayedColumns: string[] = ['name', 'access'];
  dataSource = new MatTableDataSource<ModuleRole>(this.ELEMENT_DATA);

  constructor(
    private _dataServ:DataService,
    public usuariosServ:UsuariosService,
    private _dialog:MatDialog,
  ){}
  
  ngOnInit(): void {
    this.getAllRoles();
    this.getAllModules();
  }

  getAllRoles() {
    let resp = this.usuariosServ.getAllRoles()
    resp?.subscribe(roles => {
      this.roles = roles.result as Role[]
      this.isLoadingResults = false
    }, (err => {
      this.isLoadingResults = false
    }))
  }

  onRoleSelected() {
    this.getAllModulesById(this.selected);
    
  }

  modulesToLoad(): ModuleRole[] {
    const listModule: ModuleRole[] = [];
    this.modules.forEach( module => {
      const foundItem = this.modulesRole.filter(x => x.idModule.toString() == module.id);
      const selected = Object.keys(foundItem).length !== 0;
      listModule.push({ ...module, selected });
    })
    return listModule;
  }

  getAllModulesById(id : string) {
    let resp = this.usuariosServ.getModulesByRole(id)
    resp?.subscribe(modules => {
      this.modulesRole = modules.result as RoleModule[]
      this.isLoadingResults = false
      this.dataSource.data = this.modulesToLoad();
    }, (err => {
      this.isLoadingResults = false
    }))
  }

  getAllModules() {
    let resp = this.usuariosServ.getAllModules()
    resp?.subscribe(modules => {
      this.modules = modules.result as Module[]
      this.isLoadingResults = false
    }, (err => {
      this.isLoadingResults = false
    }))
  }

  onUpdateAccess(){
    const modulesAccess:any = []
    this.dataSource.data.forEach(element => {
      if( element.selected )
        modulesAccess.push(element.id)
    });
    const res = this.usuariosServ.updateModuleRole(modulesAccess , this.selected)
    res?.subscribe(res => {
      if(res){
        this.usuariosServ.notify('Accesos actualizados', 'success')
        this.isLoadingResults = true
        this.getAllRoles()
        this.dataSource.data = []
        this.selected = '';
      }
    }, (err => {
      this.getAllRoles()
      this.usuariosServ.notify('Ocurrio un error con el proceso.', 'error')
    }))
  }

  onCheckboxChange(event: MatCheckboxChange, roleId: string) {
    const updatedDataSource = this.dataSource.data.map(item => {
      if (item.id === roleId) {
        item.selected = event.checked;
      }
      return item;
    });
    this.dataSource.data = updatedDataSource;
  }
}
