import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Especialidad } from 'src/app/interfaces/models';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-detalle-espacialidad',
  templateUrl: './detalle-espacialidad.html',
  styleUrls: ['./detalle-espacialidad.scss'],
})
export class DetalleEspacialidad implements OnInit {
  currentEspecialidad!: Especialidad | any;
  name!: string;
  isLoadingResults!: boolean;

  constructor(
    public dialogo: MatDialogRef<DetalleEspacialidad>,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    if (this.data.especialId) {
      this.getSpecialty();
    }
  }

  public async getSpecialty() {
    try {
      this.isLoadingResults = true;
      this.currentEspecialidad = await this.apiService.get(
        `Discipline/${this.data.especialId}`
      );
      this.name = this.currentEspecialidad.name;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Consultando especialidades:'
        ),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  save() {
    let Specialty: any = {
      name: this.name,
      ip: this.sharedService.userIP,
      device: this.sharedService.userDevice,
    };
    if (this.data.especialId) {
      Specialty = {
        ...Specialty,
        id: this.data.especialId,
        isActive: this.currentEspecialidad.isActive,
      };
      this.updateSpecialty(Specialty);
    } else {
      Specialty = {
        ...Specialty,
        isActive: true,
      };
      this.addSpecialty(Specialty);
    }
    this.dialogo.close(true);
  }

  public async updateSpecialty(specialty: any) {
    try {
      this.isLoadingResults = true;
      await this.apiService.put(`Discipline`, specialty);
      this.sharedService.notify('Especialidad actualizada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Actualizando especialidades:'
        ),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  public async addSpecialty(specialty: any) {
    try {
      this.isLoadingResults = true;
      await this.apiService.post(`Discipline`, specialty);
      this.sharedService.notify('Especialidad registrada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Creando especialidades:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }
}
