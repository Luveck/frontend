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
    private _authServ: AuthService,
    private info: SharedService
  ) {}

  ngOnInit(): void {}

  onForgot(formData: any) {
    if (!this.dataServ.progress) {
      this.dataServ.progress = true;
      this._authServ
        .forgotPass(formData)
        .then((res: any) => {
          console.log(res);
          this.dataServ.progress = false;
          this.dataServ.fir(`${res.messages}`, 'success');
          this.resetEmailSendMsg = res.messages;
        })
        .catch((error: any) => {
          this.dataServ.progress = false;
          console.log(error);
          let msgError = error.error.messages;
          this.dataServ.fir(`${msgError}`, 'error');
        });
    }
  }
}
