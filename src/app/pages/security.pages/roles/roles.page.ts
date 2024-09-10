import { Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Role } from 'src/app/interfaces/models';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DetalleRole } from '../detalle-role/detalle-role';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})

export class RolesPage {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de Roles',
        isLink: false,
      }
    ]
  }

  @Input('ELEMENT_DATA')  ELEMENT_DATA!:Role[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns: string[] = ['name', 'isDeleted', 'acctions'];
  dataSource = new MatTableDataSource<Role>(this.ELEMENT_DATA);
  isLoadingResults:boolean = true;

  constructor(
    private _dataServ:DataService,
    public usuariosServ:UsuariosService,
    private _dialog:MatDialog,
  ){}

  chageState(row:any){
    let msgDialog:string
    if(row.state){
      msgDialog = '¿Seguro de querer inhabilitar el role?'
    }else{
      msgDialog = '¿Seguro de querer habilitar el role?'
    }
    this._dialog.open(DialogConfComponent, {
      data: msgDialog
    })
    .afterClosed()
    .subscribe((confirmado:boolean)=>{
      if(confirmado){
        row.isActive = !row.isActive
        const res = this.usuariosServ.deletRole(row.name, row.id, row.state)
          res?.subscribe(res => {
            if(res){
              this.usuariosServ.notify('Role actualizado', 'success')
              this.isLoadingResults = true
              this.getAllRoles()
            }
          }, (err => {
            console.log(err)
            this.getAllRoles()
            this.usuariosServ.notify('Ocurrio un error con el proceso.', 'error')
          }))
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllRoles()
  }

  getAllRoles() {
    let resp = this.usuariosServ.getAllRoles()
    resp?.subscribe(roles => {
      this.dataSource.data = roles.result as Role[]
      this.isLoadingResults = false
    }, (err => {
      this.isLoadingResults = false
    }))
  }

  on(id?:string){
    const config = {
      data: {
        title: id ?'Editar Role' :'Agregar Role',
        roleId: id
      }
    }
    this._dialog.open(DetalleRole, config)
    .afterClosed()
    .subscribe((confirm:boolean) => {
      if(confirm){
        this.isLoadingResults = true
        this.getAllRoles()
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
