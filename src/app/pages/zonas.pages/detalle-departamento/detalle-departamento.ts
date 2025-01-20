import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Departamento, Pais } from 'src/app/interfaces/models';
import { ZonasService } from 'src/app/services/zonas.service';
import { SharedService } from 'src/app/services/shared.service';
import { ApiService } from 'src/app/services/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-detalle-departamento',
  templateUrl: './detalle-departamento.html',
  styleUrls: ['./detalle-departamento.scss'],
})
export class Detalledepartamento implements OnInit {
  currentDepartamento!: Departamento | any;
  paises!: Pais[];
  isLoadingResults!: boolean;

  public departamentoForm = new FormGroup({
    idCountry: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
  });

  constructor(
    public dialogo: MatDialogRef<Detalledepartamento>,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    if (this.data.departamentoId) {
      this.getDepartement();
    }
    this.comboCountry();
  }

  public async comboCountry() {
    if (this.sharedService.getCountryList().length == 0) {
      await this.sharedService.setCountry();
    }
    this.paises = this.sharedService.getCountryList();
  }
  public async getDepartement() {
    try {
      this.currentDepartamento = await this.apiService.get(
        `Department/${this.data.departamentoId}`
      );
      this.initValores();
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Consultando departamentos:'
        ),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }
  initValores() {
    this.departamentoForm.patchValue({
      idCountry: this.currentDepartamento.countryId,
      name: this.currentDepartamento.name,
    });
  }

  resetForm() {
    this.departamentoForm.reset();
  }

  save() {
    let department: any = {
      countryId: this.departamentoForm.value.idCountry,
      name: this.departamentoForm.value.name,
      Ip: this.sharedService.userIP,
      Device: this.sharedService.userDevice,
    };
    if (this.data.departamentoId) {
      department = {
        ...department,
        id: this.data.departamentoId,
        isActive: this.currentDepartamento.isActive,
      };
      this.updatedDepartment(department);
    } else {
      department = {
        ...department,
        isActive: true,
      };
      this.addDepartment(department);
    }
    this.dialogo.close(true);
  }

  public async addDepartment(department: any) {
    try {
      await this.apiService.post('Department', department);
      this.sharedService.notify('Departamento registrado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Creando departamentos:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  public async updatedDepartment(department: any) {
    try {
      await this.apiService.put('Department', department);
      this.sharedService.notify('Departamento actualizado', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(
          error,
          'Actualizando departamentos:'
        ),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }
}
