import { Component, OnInit  } from '@angular/core'
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

export class ChangePasswordPage implements OnInit {
  public resetPassForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(
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

  ngOnInit(): void {

  }

  resetPass(formData:any){
    console.log(formData)
    if(!this.dataServ.progress){
      this.dataServ.progress = true
      const peticion = this._usersServ.changePassword(formData)
      peticion.subscribe((res:any)=>{
        console.log(res)
        this.dataServ.progress = false
        this._usersServ.notify(`${res.messages}`, 'success')
        this._authServ.logOut(this._authServ.userData.Role)
      }, err => {
        console.log(err)
        let msgError = err.error.messages
        this._usersServ.notify(`${msgError}`, 'error')
      })
    }
  }
}
