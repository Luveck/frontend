import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Patology } from 'src/app/interfaces/models';
import { ApiService } from 'src/app/services/api.service';
import { MedicosService } from 'src/app/services/medicos.service';
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
    private _medicServ: MedicosService,
    private apiService: ApiService,
    private sharedService: SharedService,
    public dialogo: MatDialogRef<DetallePatologia>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
      this.sharedService.notify('Ocurrio un error con la petición', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }

  save() {
    let patology: any = {
      name: this.name,
      Ip: this.sharedService.userIP,
      Device: this.sharedService.userDevice,
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
      this.sharedService.notify('Ocurrio un error con la petición', 'error');
    }
  }

  public async addPatology(patology: any) {
    try {
      await this.apiService.post('Patology', patology);
      this.sharedService.notify('Patología registrada', 'success');
    } catch (error) {
      this.sharedService.notify('Ocurrio un error con la petición', 'error');
    }
  }
}
