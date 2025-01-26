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
    private _authServ: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.email = params.mail;
      this.code = params.id;
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

    // if(!this.dataServ.progress){
    //   this.dataServ.progress = true
    //   let formData:any = this.resetPassForm.value
    //   formData.email = this.email
    //   formData.code = this.code
    //   console.log(formData)
    //   this._authServ.resetPass(formData)
    //     .then((res:any) => {
    //       console.log(res)
    //       this.dataServ.progress = false
    //       this._authServ.userToken = res.result.token
    //       localStorage.setItem('LuveckUserToken', this._authServ.userToken)
    //       this.dataServ.fir('Su contraseña se ha cambiado correctamente.', 'success')
    //       this._authServ.decodeToken(this._authServ.userToken)
    //     })
    //     .catch ((error:any)=>{
    //       this.dataServ.progress = false
    //       console.log(error)
    //       let msgError = error.error.messages
    //       this.dataServ.fir(`${msgError}`, 'error')
    //     })
    // }
  }
}
