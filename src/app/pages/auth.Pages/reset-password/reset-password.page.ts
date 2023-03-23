import { Component, OnInit  } from '@angular/core'
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
  email:string = ''
  code:string = ''

  public resetPassForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
    )]),
    confirmPassword: new FormControl('', [Validators.required]),
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

  constructor(private _dataServ:DataService, public authServ:AuthService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params:any) => {
      console.log(params)
      this.email = params.mail
      this.code = params.id
    })
  }

  resetPass(){
    let formData:any = this.resetPassForm.value
    formData.email = this.email
    formData.code = this.code
    console.log(formData)
    const peticion = this.authServ.resetPass(formData)
    peticion.subscribe(()=>{
      this._dataServ.fir('Su contraseña ha sido  actualizada', 'success')
      this._dataServ.goTo('/')
    })
  }
}
