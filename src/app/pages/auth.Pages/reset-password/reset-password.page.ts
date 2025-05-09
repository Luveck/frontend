import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgPasswordValidatorOptions } from 'ng-password-validator';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  email: string = '';
  code: string = '';
  dni: string = '';

  public resetPassForm = new FormGroup({
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
    private readonly _authServ: AuthService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.email = params.mail;
      this.code = params.id;
      this.dni = params.dni;
    });
  }

  resetPass() {
    if (
      this.resetPassForm.get('newPassword')?.value !=
      this.resetPassForm.get('confirmPassword')?.value
    ) {
      this.dataServ.fir(
        'Los campos <b>Nueva contraseña</b> y <b>Confirmar contraseña</b> deben coincidir entre si.',
        'info'
      );
      return;
    }

    const response = this._authServ.resetPassword({
      email: this.email,
      token: this.code,
      dni: this.dni,
      password: this.resetPassForm.get('newPassword')?.value,
    });

    if (response != null) {
      this.dataServ.goTo('/authentication/login');
    }
  }
}
