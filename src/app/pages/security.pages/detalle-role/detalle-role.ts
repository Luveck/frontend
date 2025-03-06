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
    public dialogo: MatDialogRef<DetalleRole>,
    private readonly sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly usuariosServ: UsuariosService
  ) {}

  ngOnInit(): void {
    if (this.data.roleId) {
      this.getRole();
    }
  }

  private async getRole() {
    this.isLoadingResults = true;
    this.role = await this.usuariosServ.getRoleById(this.data.roleId);
    this.name = this.role.name;
    this.isLoadingResults = false;
  }

  save() {
    this.isLoadingResults = true;
    if (this.data.roleId) {
      this.updateRole(this.name, this.data.roleId);
    } else {
      this.addRole(this.name);
    }
    this.dialogo.close(true);
  }

  private async addRole(role: string) {
    await this.usuariosServ.addRole(role);
    this.isLoadingResults = false;
  }

  private async updateRole(role: string, id: string) {
    await this.usuariosServ.updateRole(role, id);
    this.isLoadingResults = false;
  }
}
