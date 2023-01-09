import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';

import { UsuariosService } from 'src/app/services/usuarios.service';
import { DetalleUsuarioPage } from '../detalle-usuario/detalle-usuario.page';
import { RolesPage } from '../roles/roles.page';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})

export class UsuariosPage implements AfterViewInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home'
      },
      {
        name: 'Gestión de usuarios',
        isLink: false,
      }
    ]
  }

  @Input('ELEMENT_DATA')  ELEMENT_DATA!:any[];
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort | null;
  displayedColumns: string[] = ['dni', 'name', 'state', 'acctions'];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);

  isLoadingResults:boolean = true;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _usuariosServ:UsuariosService
  ){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.getAllUsers()
  }

  getAllUsers(){
    this._usuariosServ.getAllUsers().subscribe((res:any) => {
      console.log(res)
      this.dataSource.data = res.result as any[]
      this.isLoadingResults = false
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  on(email?:string){
    const config = {
      data: {
        title: email ?'Editar Usuario' :'Agregar Usuario',
        userEmail: email
      }
    }
    this._dialog.open(DetalleUsuarioPage, config)
    .afterClosed()
    .subscribe((confirmado:boolean) => {
      if(confirmado){
        this.isLoadingResults = true
        this.getAllUsers()
      }
    })
  }

  dialog(id: string, estado: boolean) {
    let msg = estado ? '¿Seguro de querer inhabilitar esta cuenta?' : '¿Seguro de querer habilitar esta cuenta?'

    this._dialog.open(DialogConfComponent, {
      data: `${msg}`
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          let respuesta = this._usuariosServ.UpdateUsuario(null, id, estado)
          this._usuariosServ.notify('Registro actualizado', 'success')
          this.getAllUsers()
        }
      })
  }

  onModalRoles(){
    this._dialog.open(RolesPage)
    .afterClosed()
    .subscribe((confirmado:boolean) => {
      if(confirmado){
        this.isLoadingResults = true
        this.getAllUsers()
      }
    })
  }
}
