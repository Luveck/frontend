import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Patology } from 'src/app/interfaces/models';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-detalle-patologia',
  templateUrl: './detalle-patologia.html',
  styleUrls: ['./detalle-patologia.scss'],
})
export class DetallePatologia implements OnInit {
  currentPatology!: Patology | any;
  name!: string;
  isLoadingResults!: boolean;

  constructor(
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    public dialogo: MatDialogRef<DetallePatologia>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    if (this.data.especialId) {
      this.getPatology();
      this.isLoadingResults = false;
    }
  }

  public async getPatology() {
    try {
      this.isLoadingResults = true;
      this.currentPatology = await this.apiService.get(
        `Patology/${this.data.especialId}`
      );
      this.name = this.currentPatology.name;
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Consultando patologias:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  save() {
    let patology: any = {
      name: this.name,
    };
    if (this.data.especialId) {
      patology = {
        ...patology,
        id: this.data.especialId,
        isActive: this.currentPatology.isActive,
      };
      this.updatePatology(patology);
    } else {
      patology = {
        ...patology,
        isActive: true,
      };
      this.addPatology(patology);
    }
    this.dialogo.close(true);
  }

  public async updatePatology(patology: any) {
    try {
      await this.apiService.put('Patology', patology);
      this.sharedService.notify('Patología actualizada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizar patologias:'),
        'error'
      );
    }
  }

  public async addPatology(patology: any) {
    try {
      await this.apiService.post('Patology', patology);
      this.sharedService.notify('Patología registrada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Crear patologias:'),
        'error'
      );
    }
  }
}
