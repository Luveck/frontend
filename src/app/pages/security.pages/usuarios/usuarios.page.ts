import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { UsuariosService } from 'src/app/services/usuarios.service';
import { DetalleUsuario } from '../detalle-usuario/detalle-usuario';
import { RolesPage } from '../roles/roles.page';
import { SharedService } from 'src/app/services/shared.service';
import { UserRoles } from 'src/app/shared/enums/roles.enum';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SessionService } from 'src/app/services/session.service';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  public breadcrumb = {
    links: [
      {
        name: 'Inicio',
        isLink: true,
        link: '/admin/home',
      },
      {
        name: 'Gestión de usuarios',
        isLink: false,
      },
    ],
  };

  @Input('ELEMENT_DATA') ELEMENT_DATA!: any[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort | null;
  displayedColumns: string[] = ['dni', 'name', 'role', 'state', 'acctions'];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  dataUsers!: any[];

  isLoadingResults: boolean = true;

  private countryId = '';

  constructor(
    private readonly _liveAnnouncer: LiveAnnouncer,
    private readonly _dialog: MatDialog,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly usuariosServ: UsuariosService,
    private readonly sharedService: SharedService,
    private readonly sessionService: SessionService,
    private readonly countryService: CountryService
  ) {}
  ngOnInit(): void {
    console.log(this.sessionService.getUserData().Role);
    this.countryService.countryId$.subscribe((country) => {
      this.countryId = country;
      this.getUsers();
    });
  }

  private async getUsers() {
    try {
      this.dataUsers = await this.usuariosServ.setUsersByCountry(
        this.countryId
      );
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Consultando usuarios:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
      if (this.sessionService.getUserData().Role !== UserRoles.Admin) {
        this.dataSource.data = this.dataUsers.filter((x) => {
          x.roles.includes(UserRoles.Cliente);
        });
      } else {
        this.dataSource.data = this.dataUsers;
      }

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource) {
      this.dataSource.filter = filterValue;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  on(dni?: string) {
    const config = {
      data: {
        title: dni ? 'Editar Usuario' : 'Agregar Usuario',
        userDni: dni,
      },
    };
    this._dialog
      .open(DetalleUsuario, config)
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.isLoadingResults = true;
          this.getUsers();
        }
      });
  }

  onModalRoles() {
    this._dialog
      .open(RolesPage)
      .afterClosed()
      .subscribe(() => {
        this.isLoadingResults = true;
        this.getUsers();
      });
  }
}
