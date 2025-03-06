import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgPasswordValidatorOptions } from 'ng-password-validator';
import { AuthService } from 'src/app/services/auth.service';

import { DataService } from 'src/app/services/data.service';
import { SessionService } from 'src/app/services/session.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {
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
    public dataServ: DataService,
    private _usersServ: UsuariosService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService
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
      const data = {
        currentPassword: formData.password,
        NewPassword: formData.newPassword,
        user: this.sessionService.getUserData().UserId,
      };
      this.updatePass(data);
    }
  }

  private async updatePass(data: any) {
    const response = await this.authService.changePasswordAsync(data);

    this.dataServ.progress = false;

    if (response != null) {
      this.dataServ.fir(
        `Ya puede iniciar sesión con su nueva contraseña.`,
        'success',
        5000
      );
      this.authService.logOut();
    }
  }
}
