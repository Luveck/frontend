import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Cadena } from 'src/app/interfaces/models';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-detalle-cadena',
  templateUrl: './detalle-cadena.html',
  styleUrls: ['./detalle-cadena.scss'],
})
export class DetalleCadena implements OnInit {
  currentCadena!: Cadena | any;
  isLoadingResults!: boolean;

  public cadenaForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly sharedService: SharedService,
    private readonly apiService: ApiService,
    public dialogo: MatDialogRef<DetalleCadena>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data.id) {
      this.getChain();
    }
  }

  private async getChain() {
    try {
      this.isLoadingResults = true;
      this.currentCadena = await this.apiService.get(`Chain/${this.data.id}`);
      this.initValores();
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Consultando cadenas:'),
        'error'
      );
    } finally {
      this.isLoadingResults = false;
    }
  }

  initValores() {
    this.cadenaForm.patchValue({
      name: this.currentCadena.name,
    });
  }

  resetForm() {
    this.cadenaForm.reset();
  }

  save() {
    let chain: any = {
      name: this.cadenaForm.value.name,
    };
    if (this.data.id) {
      chain = {
        ...chain,
        id: this.data.id,
        isActive: this.currentCadena.isActive,
      };
      this.updateChain(chain);
    } else {
      chain = {
        ...chain,
        isActive: true,
      };
      this.addChain(chain);
    }
    this.dialogo.close(true);
  }

  private async addChain(chain: any) {
    try {
      await this.apiService.post('Chain', chain);
      this.sharedService.notify('Cadena registrada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Creando cadenas:'),
        'error'
      );
    } finally {
      this.isLoadingResults = true;
    }
  }

  private async updateChain(chain: any) {
    try {
      await this.apiService.put(`Chain`, chain);
      this.sharedService.notify('Cadena actualizada', 'success');
    } catch (error) {
      this.sharedService.notify(
        this.errorHandlerService.handleError(error, 'Actualizando cadenas:'),
        'error'
      );
    } finally {
      this.isLoadingResults = true;
    }
  }
}
