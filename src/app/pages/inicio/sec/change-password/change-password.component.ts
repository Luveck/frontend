import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UsuariosService } from 'src/app/services/usuarios.service';
import { DataService } from 'src/app/services/data.service';
import { NgPasswordValidatorOptions } from 'ng-password-validator';
import { ClientProfileComponent } from '../client-profile/client-profile.component';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  userData!: any;
  isLoadingResults?: boolean;
  enabledEdit: boolean = false;

  public changePassForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
      ),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  hidePassword: boolean = true;
  hidePasswordConfirmation: boolean = true;
  hideOldPassword: boolean = true;
  options: NgPasswordValidatorOptions = {
    heading: 'Requisitos',
    successMessage: 'Contraseña segura',
    rules: {
      password: {
        type: 'range',
        min: 8,
        max: 12,
      },
      'include-symbol': true,
      'include-number': true,
      'include-lowercase-characters': true,
      'include-uppercase-characters': true,
    },
  };

  constructor(
    public dialogo: MatDialogRef<ChangePasswordComponent>,
    private _dialog: MatDialog,

    public dataServ: DataService,
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  chagePass(formData: any) {
    if (
      this.changePassForm.get('newPassword')?.value !=
      this.changePassForm.get('confirmPassword')?.value
    ) {
      this.dataServ.fir(
        'Los campos <b>Nueva contraseña</b> y <b>Confirmar contraseña</b> deben coincidir entre si.',
        'info'
      );
      return;
    }

    if (!this.dataServ.progress) {
      this.dataServ.progress = true;
      this.changePassword();
    }
  }

  private async changePassword() {
    const data = {
      currentPassword: this.changePassForm.get('password')?.value,
      newPassword: this.changePassForm.get('newPassword')?.value,
      user: this.sessionService.getUserData().UserId,
    };

    this.isLoadingResults = true;
    const response = await this.authService.changePassword(data);
    this.isLoadingResults = false;
    if (response != null) {
      this.cancel();
    }
    this.dataServ.progress = false;
  }
  cancel() {
    this._dialog.closeAll();
    const config: MatDialogConfig = {
      data: this.data,
    };
    this._dialog.open(ClientProfileComponent, config);
  }
}
