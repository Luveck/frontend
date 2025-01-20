import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfComponent } from 'src/app/components/dialog-conf/dialog-conf.component';
import { Role } from 'src/app/interfaces/models';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DetalleRole } from '../detalle-role/detalle-role';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})
export class RolesPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de Roles',
        isLink: false,
      },
    ],
  };

  @Input('ELEMENT_DATA') ELEMENT_DATA!: Role[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort | null;
  displayedColumns: string[] = ['name', 'acctions'];
  dataSource = new MatTableDataSource<Role>(this.ELEMENT_DATA);
  isLoadingResults: boolean = true;

  constructor(
    private readonly _dataServ: DataService,
    private readonly _dialog: MatDialog,
    public readonly usuariosServ: UsuariosService,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getRoles();
  }

  chageState(row: any) {
    let msgDialog: string = '¿Seguro de querer eliminar el role?';
    this._dialog
      .open(DialogConfComponent, {
        data: msgDialog,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.deleteRole(row.id);
        }
      });
  }

  private async deleteRole(role: any) {
    try {
      await this.apiService.delete(`Role?id=${role}`);
      this.sharedService.notify('Role eliminado.', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Borrar role:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
      this.getRoles();
    }
  }
  private async getRoles() {
    this.isLoadingResults = true;
    await this.usuariosServ.setRoles();
    this.dataSource.data = this.usuariosServ.getRoles();
    this.isLoadingResults = false;
  }

  on(id?: string) {
    const config = {
      data: {
        title: id ? 'Editar Role' : 'Agregar Role',
        roleId: id,
      },
    };
    this._dialog
      .open(DetalleRole, config)
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.getRoles();
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
