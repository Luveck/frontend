import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  resetEmailSendMsg: string = '';

  public forgotPassForm = new FormGroup({
    dni: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]+$'),
      Validators.minLength(2),
    ]),
  });

  constructor(
    public dataServ: DataService,
    private readonly authServ: AuthService,
    private readonly info: SharedService
  ) {}

  ngOnInit(): void {}

  onForgot(formData: any) {
    const dni = formData.dni;
    this.getForgot(dni);
  }

  private async getForgot(dni: string) {
    await this.authServ.forgotPassword(dni);
  }
}
