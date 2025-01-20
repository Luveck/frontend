import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Especialidad, Medico } from 'src/app/interfaces/models';
import { MedicosService } from 'src/app/services/medicos.service';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-detalle-medico',
  templateUrl: './detalle-medico.html',
  styleUrls: ['./detalle-medico.scss'],
})
export class DetalleMedico implements OnInit {
  currentMedic!: Medico | any;
  especialidades!: Especialidad[];
  isLoadingResults!: boolean;

  public medicForm = new FormGroup({
    name: new FormControl('', Validators.required),
    register: new FormControl('', Validators.required),
    patologyId: new FormControl('', Validators.required),
  });

  constructor(
    private readonly medicServ: MedicosService,
    private readonly apiService: ApiService,
    private readonly sharedService: SharedService,
    public dialogo: MatDialogRef<DetalleMedico>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.getSpecialist();

    if (this.data.medicoId) {
      this.getMedical();
    }
  }

  private async getSpecialist() {
    await this.medicServ.setSpecialties();
    this.isLoadingResults = false;
    this.especialidades = this.medicServ.getSpecialties();
  }

  private async getMedical() {
    try {
      this.currentMedic = await this.apiService.get(
        `Medical/${this.data.medicoId}`
      );
      this.initValores();
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Consultando medicos:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  initValores() {
    this.medicForm.patchValue({
      name: this.currentMedic.name,
      register: this.currentMedic.register,
      patologyId: this.currentMedic.patologyId,
    });
  }

  resetForm() {
    this.medicForm.reset();
  }

  private async addMedical(medical: any) {
    try {
      await this.apiService.post('Medical', medical);
      this.sharedService.notify('Médico registrado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Crear medicos:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  private async updateMedical(medical: any) {
    try {
      await this.apiService.put('Medical', medical);
      this.sharedService.notify('Médico actualizado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizar medicos:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }
  save() {
    let medical: any = {
      name: this.medicForm.value.name,
      register: this.medicForm.value.register,
      disciplineId: this.medicForm.value.patologyId,
      countryId: 1,
    };
    medical = this.sharedService.addIpDevice(medical);
    if (this.data.medicoId) {
      medical = {
        ...medical,
        id: this.data.medicoId,
        isActive: this.currentMedic.isActive,
      };
      this.updateMedical(medical);
    } else {
      medical = {
        ...medical,
        isActive: true,
      };
      this.addMedical(medical);
    }
    this.dialogo.close(true);
  }
}
