import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgPasswordValidatorOptions } from 'ng-password-validator';

import { ModalProdIniComponent } from 'src/app/components/modal-prod-ini/modal-prod-ini.component';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage {
  localTheme:boolean = true
  darkClassName:string = 'theme-dark';
  SectionSelect:string = 'inicio'

  @HostBinding('class') className = '';

  public registerForm = new FormGroup({
    dni : new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(
      '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$',
    ),]),
    name : new FormControl('', [Validators.required]),
    lastName : new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(8)]),
    password: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
    )]),
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

  constructor(
    private _overlay: OverlayContainer,
    private _dialog: MatDialog,
    public dataServ: DataService,
    private _authServ:AuthService
  ){
    let theme = this.dataServ.getTheme()
    if(theme === 'dark'){
      this.localTheme = false
      this.className = this.darkClassName
      this.dataServ.setTheme('dark')
      this._overlay.getContainerElement().classList.add(this.darkClassName);
    }else{
      this.localTheme = true
      this.className = ''
      this.dataServ.setTheme('light')
      this._overlay.getContainerElement().classList.remove(this.darkClassName);
    }
  }

  setTheme(){
    this.localTheme = !this.localTheme
    if(!this.localTheme){
      this.localTheme = false
      this.className = this.darkClassName
      this.dataServ.setTheme('dark')
      this._overlay.getContainerElement().classList.add(this.darkClassName);
    }else{
      this.localTheme = true
      this.className = ''
      this.dataServ.setTheme('light')
      this._overlay.getContainerElement().classList.remove(this.darkClassName);
    }
  }

  ingresar(){
    this.dataServ.goTo('authentication/login')
  }

  openModalProd(){
    const config = {
      data: {
        id: ''
      }
    }
    this._dialog.open(ModalProdIniComponent, config)
  }

  onRegister(formData:any){
    if(!this.dataServ.progress){
      this.dataServ.progress = true
      this._authServ.register(formData)
    }
  }
}
