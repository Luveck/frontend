import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgPasswordValidatorOptions } from 'ng-password-validator';
import { AuthService } from 'src/app/services/auth.service';

import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})

export class ChangePasswordPage {
  public changePassForm = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(
      '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$',
    ),]),
    password: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
    )]),
    confirmPassword: new FormControl('', [Validators.required])
  })

  hidePassword:boolean = true;
  options:NgPasswordValidatorOptions = {
    'heading': 'Requisitos',
    'successMessage': 'Contraseña segura',
    'rules': {
      'password': {
        'type': "range",
        'min': 8,
        'max': 12
      },
      'include-symbol': true,
      'include-number': true,
      'include-lowercase-characters': true,
      'include-uppercase-characters': true,
    }
  }

  constructor(public dataServ: DataService, private _usersServ:UsuariosService, private _authServ:AuthService){}

  chagePass(formData:any){
    if(this.changePassForm.get('newPassword')?.value != this.changePassForm.get('confirmPassword')?.value){
      this.dataServ.fir('Los campos <b>Nueva contraseña</b> y <b>Confirmar contraseña</b> deben coincidir entre si.', 'info')
      return
    }

    if(!this.dataServ.progress){
      this.dataServ.progress = true
      const peticion = this._usersServ.changePassword(formData)
      peticion?.subscribe((res:any)=>{
        console.log(res)
        this.dataServ.progress = false
        this.dataServ.fir(`${res.messages} Ya puede iniciar sesión con su nueva contraseña.`, 'success', 5000)
        this._authServ.logOut(this._authServ.dataUser().Role)
      }, err => {
        console.log(err)
        this.dataServ.progress = false
        let msgError = err.error.messages
        this._usersServ.notify(`${msgError}`, 'error')
      })
    }
  }
}
