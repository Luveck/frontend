import { Component, OnInit  } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgPasswordValidatorOptions } from 'ng-password-validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})

export class ResetPasswordPage implements OnInit {
  public resetPassForm = new FormGroup({
    Newpassword: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
    )]),
    confirmPass: new FormControl('', [Validators.required])
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

  constructor(){}

  ngOnInit(): void {

  }

  resetPass(formData:any){
    console.log(formData)
  }
}
