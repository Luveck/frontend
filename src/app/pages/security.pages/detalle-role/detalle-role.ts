import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Role } from 'src/app/interfaces/models';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MedicosService } from 'src/app/services/medicos.service';
import { SharedService } from 'src/app/services/shared.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-detalle-role',
  templateUrl: './detalle-role.html',
  styleUrls: ['./detalle-role.scss'],
})
export class DetalleRole implements OnInit {
  role!: Role | any;
  name!: string;
  isLoadingResults!: boolean;

  constructor(
    public usuariosServ: UsuariosService,
    public dialogo: MatDialogRef<DetalleRole>,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    if (this.data.roleId) {
      this.getRole();
    }
  }

  private async getRole() {
    try {
      this.isLoadingResults = true;
      this.role = await this.apiService.get(`Role?id=${this.data.roleId}`);
      this.name = this.role.name;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Consultando roles:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  save() {
    if (this.data.roleId) {
      this.updateRole(this.name, this.data.roleId);
    } else {
      this.addRole(this.name);
    }
    this.dialogo.close(true);
  }

  private async addRole(role: string) {
    try {
      await this.apiService.post(`Role?name=${role}`, {});
      this.sharedService.notify('Role registrado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Creando roels:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  private async updateRole(role: string, id: string) {
    try {
      await this.apiService.put(`Role?id=${id}&name=${role}`, {});
      this.sharedService.notify('Role actualizado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando roles:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }
}
